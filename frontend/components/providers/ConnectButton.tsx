"use client";

import { useConnect, useDisconnect } from "@starknet-react/core";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { useRouter } from "next/navigation";
import useNotifications from "@/components/providers/notification-provider";
import { useAccount } from "@starknet-react/core";
import { RpcProvider, Contract } from "starknet";
import { STARKPAY_ABI } from "@/hooks/useStarkpayContract";

interface ConnectButtonProps {
  contract: any;
  onConnectSuccess: () => void;
}

export default function ConnectButton({ contract, onConnectSuccess }: ConnectButtonProps) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });
  const { address, account } = useAccount();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const registerAsMerchant = async () => {
    if (!address || !contract || !account) return;
    
    try {
      // Check if user is already registered
      const isRegisteredCall = contract.populate("is_registered", [address]);
      const isRegistered = await contract.is_registered(isRegisteredCall.calldata);
      
      if (isRegistered) {
        // User is already registered, proceed to dashboard
        onConnectSuccess();
        return;
      }
      
      // Register as merchant automatically
      const call = contract.populate("register", [address, 1]); // 1 for merchant
      const response = await account.execute(call);
      
      // Wait for transaction confirmation
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
      if (!RPC_URL) throw new Error("RPC URL not configured");
      
      await new RpcProvider({ nodeUrl: RPC_URL }).waitForTransaction(
        response.transaction_hash, 
        {
          retryInterval: 1000,
          successStates: ["ACCEPTED_ON_L2"],
        }
      );
      
      addNotification({
        id: Date.now(),
        type: "success",
        title: "Registered as Merchant",
        message: "Your account has been automatically registered as a merchant",
        timestamp: new Date(),
        read: false,
        category: "connection",
        status: "completed",
      });
      
      onConnectSuccess();
      
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = (err as Error).message || "Automatic registration failed";
      
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Registration Failed",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
        category: "connection",
        status: "failed",
      });
      
      // Still allow connection even if registration fails
      onConnectSuccess();
    }
  };

  const connectWallet = async () => {
    try {
      const { connector } = await starknetkitConnectModal();
      if (!connector) return;
      await connect({ connector: connector as any });
      
      addNotification({
        id: Date.now(),
        type: "success",
        title: "Wallet Connected",
        message: "Wallet connected successfully",
        timestamp: new Date(),
        read: false,
        category: "connection",
        status: "completed",
      });

      // Automatically register as merchant after connection
      if (contract && address) {
        await registerAsMerchant();
      }
      
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to connect wallet";
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Connection Failed",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
        category: "connection",
        status: "failed",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
    addNotification({
      id: Date.now(),
      type: "info",
      title: "Wallet Disconnected",
      message: "You have been disconnected from your wallet",
      timestamp: new Date(),
      read: false,
      category: "connection",
      status: "completed",
    });
  };

  return (
    <>
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
          onClick={handleDisconnect}
          className="py-[10px] cursor-pointer relative px-[31px] w-fit text-white text-[18px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
        >
          <div className="text-white flex flex-none font-[500] text-center sm:text-base transform">
            Disconnect
          </div>
        </button>
      )}
    </>
  );
}