"use client";

import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConnectButton from "./ConnectButton";
import Register from "@/components/providers/Register";
import { RpcProvider, Contract } from "starknet";
import { STARKPAY_ABI } from "@/hooks/useStarkpayContract";

export default function ConnectWallet() {
  const { address, account } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);

  // Contract configuration
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address is not set in environment variables");
  }
  const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://starknet-sepolia.public.blastapi.io";

  // Handle contract setup
  useEffect(() => {
    if (address) {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });
      const contractInstance = new Contract(STARKPAY_ABI, contractAddress, provider);
      // contractInstance.connect(account);
      setContract(contractInstance);
    } else {
      setContract(null);
      setShowRegister(false);
    }
  }, [address]);

  // Handle routing based on connection state
  useEffect(() => {
    if (address && pathname !== "/dashboard" && !showRegister) {
      router.push("/dashboard");
    } else if (!address && pathname !== "/") {
      router.push("/");
    }
  }, [address, pathname, router, showRegister]);

  return (
    <>
      {showRegister && contract && (
        <Register
          onRegister={async (isMerchant: boolean) => {
            setShowRegister(false);
          }}
          isRegistering={false}
          contract={contract}
          address={address}
          account={account}
        />
      )}
      <ConnectButton
        onShowRegister={() => setShowRegister(true)}
        contract={contract}
      />
    </>
  );
}