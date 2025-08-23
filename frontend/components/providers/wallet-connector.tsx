"use client";

import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConnectButton from "./ConnectButton";
import { RpcProvider, Contract } from "starknet";
import { STARKPAY_ABI } from "@/hooks/useStarkpayContract";

export default function ConnectWallet() {
  const { address, account } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);

  // Contract configuration
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address is not set in environment variables");
  }
  const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "";

  // Handle contract setup
  useEffect(() => {
    if (address) {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });
      const contractInstance = new Contract(STARKPAY_ABI, contractAddress, provider);
      setContract(contractInstance);
    } else {
      setContract(null);
    }
  }, [address]);

  //Handle routing based on connection state
  useEffect(() => {
    // Don't do any redirects for /pay route
    if (pathname === "/pay") {
      return;
    }

    if (!address) {
      // If not connected and on dashboard, redirect to home
      if (pathname === "/dashboard") {
        router.push("/");
      }
      return;
    }

    // If connected and not on dashboard, redirect to dashboard
    if (address && pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  }, [address, pathname, router]);

  const handleConnectSuccess = () => {
    // Redirect to dashboard after successful connection and registration
    if (address && pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  return (
    <ConnectButton
      contract={contract}
      onConnectSuccess={handleConnectSuccess}
    />
  );
}