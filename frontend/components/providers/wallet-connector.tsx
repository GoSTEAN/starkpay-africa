"use client";

import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useContract,
} from "@starknet-react/core";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { useEffect, useState } from "react";
import Register from "../dashboard/home/register";
import { CallData, RpcProvider, Contract } from "starknet";
import { STARKPAY_ABI } from "@/hooks/useStarkpayContract";
import { toast } from "react-toastify";

export function WalletConnectorModal() {
  // Wallet connection
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });
  const { address, account } = useAccount();

  // State
  const [showRegister, setShowRegister] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState<bigint | null>(null);

  // Contract configuration
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  if (!contractAddress) {
    console.error("Contract address is not set in environment variables");
    return null;
  }
  
  // Create a direct contract instance to bypass useContract limitations
  const [contract, setContract] = useState<Contract | null>(null);
  const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 
    "https://starknet-sepolia.public.blastapi.io";

  useEffect(() => {
    if (address) {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });
      const contractInstance = new Contract(STARKPAY_ABI, contractAddress, provider);
      setContract(contractInstance);
    }
  }, [address]);

  // Check user role from contract
  const checkUserRole = async () => {
    if (!address || !contract) return;

    try {
      // Using the direct call method with proper ABI typing
      const result = await contract.get_user_role(address);
      setUserRole(BigInt(result));
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole(null);
    }
  };

  // Handle wallet connection
  const connectWallet = async () => {
    try {
    const { connector } = await starknetkitConnectModal();
      if (!connector) return;
    await connect({ connector: connector as Connector });
    } catch (error) {
      toast.error("Failed to connect wallet");
      console.error("Connection error:", error);
    }
  };

  // Handle user registration
  const registerUser = async (isMerchant: boolean) => {
    if (!address || !account || !contract) return;

    try {
      setIsRegistering(true);
      
      // Using the populated transaction with full ABI support
      const call = contract.populate("register", {
        addr: address,
        is_merchant: isMerchant
      });

      const response = await account.execute(call);
      toast.info("Transaction submitted...", { 
        toastId: "tx-submitted",
        autoClose: false 
      });

      const provider = new RpcProvider({ nodeUrl: RPC_URL });
      await provider.waitForTransaction(response.transaction_hash, {
        retryInterval: 1000,
        successStates: ["ACCEPTED_ON_L2"]
      });

      toast.dismiss("tx-submitted");
      toast.success("Registration successful!");
      await checkUserRole();
      setShowRegister(false);
    } catch (error) {
      toast.dismiss("tx-submitted");
      toast.error("Registration failed");
      console.error("Registration error:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  // Effect to check role on address change
  useEffect(() => {
    if (address) {
      checkUserRole();
      const interval = setInterval(checkUserRole, 15000);
      return () => clearInterval(interval);
    } else {
      setUserRole(null);
    }
  }, [address, contract]);

  // Show registration modal for unregistered users
  useEffect(() => {
    if (address && userRole !== null) {
      setShowRegister(userRole === BigInt(0));
    }
  }, [address, userRole]);

    return (
    <>
      {showRegister && (
        <Register 
          onRegister={registerUser} 
          isRegistering={isRegistering} 
        />
      )}
      
      {!address ? (
      <button
        onClick={connectWallet}
        className="py-[10px] cursor-pointer flex-none relative px-[31px] w-fit text-white text-[18px] font-[500] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
      >
        CONNECT WALLET
        <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
      </button>
      ) : (
    <button
      onClick={() => disconnect()}
             className="py-[10px] cursor-pointer relative px-[31px] w-fit text-white text-[18px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
    >
          <div className="text-white flex flex-none font-[500] text-center sm:text-base transform">
            {address?.slice(0, 4)}...{address?.slice(-2)}
      </div>
    </button>
      )}
    </>
  );
}