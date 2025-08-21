import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useUserRole } from "@/hooks/getUserRole";
import { Contract, RpcProvider } from "starknet";
import BecomeAMerchant from "./become-a-marchant";
import { STARKPAY_ABI as MERCHANT_ABI } from "@/hooks/useStarkpayContract";

const MERCHANT_ADDRESS = "0x01f7d31c6f11046029310be2e7810189eb6b4581049b4d35047fbc8e42ab75a4";

export default function DashboardHome() {
  const { account, address } = useAccount();
  const { role, loading, error, isMerchant } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  if (loading)
    return (
      <span className="px-3 z-10 py-1 text-lg bg-gray-100 text-white rounded-full animate-pulse">
        Loading...
      </span>
    );

  if (error)
    return (
      <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full">
        Error
      </span>
    );

  if (role === null) return null;

  const img = "/user.jpg";

  const handleBecomeMerchant = async () => {
    if ( !address) {
      setRegisterError("Please connect your Starknet wallet");
      setRegisterLoading(false);
      return;
    }

    setRegisterLoading(true);
    setRegisterError("");

    try {
      const contract = new Contract(MERCHANT_ABI, MERCHANT_ADDRESS, provider);
      if (account) {
        contract.connect(account);
      } else {
        setRegisterError("No account found. Please connect your wallet.");
        setRegisterLoading(false);
        return;
      }
      const result = await contract.invoke("become_merchant", [], { maxFee: "0x0" }); // Explicitly invoke with maxFee
      console.log("Become merchant result:", result);
      await provider.waitForTransaction(result.transaction_hash);
      alert("Successfully registered as a merchant! Refreshing page...");
      window.location.reload();
    } catch (err: any) {
      setRegisterError(`Registration failed: ${err.message || "Unknown error"}`);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegister = (confirm: boolean) => {
    setShowModal(false);
    if (confirm) {
      handleBecomeMerchant();
    }
  };

  return (
    <section className="relative rounded-[19px] py-[66px] w-full h-full overflow-y-scroll gap-[22px] flex flex-col items-start font-[Montserrat] px-[32px]">
      <div className="w-full h-full flex flex-col gap-[32px] max-w-[688px]">
        <div className="flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Profile
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            View all your details here.
          </p>
        </div>

        <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-center">
          <h1 className="text-[22px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Tali Nanzing Moses
          </h1>
          <div className="lg:w-[183.75px] w-[120px] flex items-center justify-center lg:h-[183.75px] h-[120px] overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
            {img ? (
              <Image
                src={img}
                fill
                alt="user profile image"
                className="rotate-[-45deg]"
              />
            ) : (
              <User color="white" size={100} className="rotate-[-45deg]" />
            )}
          </div>
          <button
            type="button"
            className="text-[#AEA8A8] text-[14px] cursor-pointer hover:text-[#FBFBFB] font-[400] font-[Open Sans]"
          >
            Edit
          </button>
        </div>
        <div className="gap-[24px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] p-[23px] rounded-[19px] opacity-100">
          <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
            <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
              Connected Wallet Address
            </h1>
            <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
              {address ? address : "No wallet connected"}
            </p>
          </div>
          <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
            <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
              Account Type
            </h1>
            <p className="text-[16px] font-[400] font-[Open Sans] flex justify-between items-center text-[#FBFBFB]/50">
              <span>{isMerchant ? "Merchant" : "User"}</span>
              {!isMerchant && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="cursor-pointer bg-[#5f3ec5] text-white/80 p-[8px] rounded-md hover:bg-[#5f3ec5]/80"
                  disabled={registerLoading}
                >
                  {registerLoading ? "Registering..." : "Become a Merchant"}
                </button>
              )}
            </p>
          </div>
        </div>
        {registerError && <p className="text-red-500">{registerError}</p>}
      </div>
      {showModal && <BecomeAMerchant onRegister={handleRegister} />}
    </section>
  );
}