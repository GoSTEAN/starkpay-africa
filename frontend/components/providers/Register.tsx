"use client";

import { useRouter } from "next/navigation";
import useNotifications from "@/components/providers/notification-provider";
import { useState } from "react";
import { RpcProvider } from "starknet";

interface RegisterProps {
  onRegister: (isMerchant: boolean) => void;
  isRegistering: boolean;
  contract: any;
  address: `0x${string}` | undefined; 
  account: any;
}

export default function Register({ onRegister, isRegistering, contract, address, account }: RegisterProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [localIsRegistering, setLocalIsRegistering] = useState(false);

  const handleRegister = async (isMerchant: boolean) => {
    if (!address || !contract) return;
    
    try {
      setLocalIsRegistering(true);
      const call = contract.populate("register", [address, isMerchant ? 1 : 0]);
      const response = await account.execute(call);
      const url = process.env.NEXT_PUBLIC_RPC_URL;
  if(!url) return

      // Wait for transaction confirmation
      const RPC_URL = url;
      await new RpcProvider({ nodeUrl: RPC_URL }).waitForTransaction(response.transaction_hash, {
        retryInterval: 1000,
        successStates: ["ACCEPTED_ON_L2"],
      });
      
      addNotification({
        id: Date.now(),
        type: "success",
        title: "Registration Successful",
        message: `Registered as ${isMerchant ? "Merchant" : "User"}`,
        timestamp: new Date(),
        read: false,
        category: "transaction",
        status: "completed",
      });
      
      // Redirect to dashboard after successful registration
      router.push("/dashboard");
      onRegister(isMerchant);
      
    } catch (err) {
      const errorMessage = (err as Error).message || "Registration failed";
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Registration Failed",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
        category: "transaction",
        status: "failed",
      });
    } finally {
      setLocalIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#212324cc] flex justify-center items-center">
      <div className="max-w-[450px] max-h-[450px] h-full bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] rounded-lg justify-between flex w-full flex-col gap-[20px] py-[18px] px-[16px]">
        <div>
          <h1 className="text-[32px] font-bold text-[#8F6DF5]">Register as </h1>
          <p className="text-[14px] font-[400] text-white/70">
            Select your role to register
          </p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <button
            onClick={() => handleRegister(true)}
            disabled={localIsRegistering}
            className={`bg-[#493E71] w-full border border-[#FBFBFB1F] hover:bg-transparent text-white/70 text-2xl font-bold rounded-full py-[16px] px-[24px] transition-all ${
              localIsRegistering ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            {localIsRegistering ? "Processing..." : "Merchant"}
          </button>

          <button
            onClick={() => handleRegister(false)}
            disabled={localIsRegistering}
            className={`bg-[#493E71] w-full border border-[#FBFBFB1F] hover:bg-transparent text-white/70 text-2xl font-bold rounded-full py-[16px] px-[24px] transition-all ${
              localIsRegistering ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            {localIsRegistering ? "Processing..." : "User"}
          </button>
        </div>
      </div>
    </div>
  );
}