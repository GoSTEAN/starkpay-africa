import {
  ChevronDown,
  Copy,
  Loader,
  LogOut,
  PencilLine,
  Shield,
  User,
  Verified,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useUserRole } from "@/hooks/getUserRole";
import { Contract, RpcProvider } from "starknet";
import BecomeAMerchant from "../dashboard/home/become-a-marchant";
import { STARKPAY_ABI as MERCHANT_ABI } from "@/hooks/useStarkpayContract";


  
export default function ProfilePage() {
  const { account, address } = useAccount();
  const { role, loading, error, isMerchant } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const MERCHANT_ADDRESS =
  "0x01f7d31c6f11046029310be2e7810189eb6b4581049b4d35047fbc8e42ab75a4";

  
  const url = process.env.NEXT_PUBLIC_RPC_URL;
  if(!url) return

  const provider = new RpcProvider({
    nodeUrl: url,
  });

  if (loading)
    return (
      <span className="px-3 z-10 py-1 w-full h-full flex justify-center items-center text-lg  animate-pulse">
        <Loader color="white" className="animate-spin" size={50}/>
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
    if (!address) {
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
      const result = await contract.invoke("become_merchant", [], {
        maxFee: "0x0",
      }); 
      console.log("Become merchant result:", result);
      await provider.waitForTransaction(result.transaction_hash);
      alert("Successfully registered as a merchant! Refreshing page...");
      window.location.reload();
    } catch (err: any) {
      setRegisterError(
        `Registration failed: ${err.message || "Unknown error"}`
      );
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

  const phoneNo = "1234567890";
  const accNo = "0234567890";
  const name = "Nanzing Moses Tali"
  const emailAddress = "talinanzing111@gmail.com"
  const location = "No 4 Mozambique Barnawa Complex, Kaduna"

  return (
    <section className="relative rounded-[19px] items-center py-[66px] w-full h-full  bg-[#212324] overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px]">
      <div className="w-full h-full flex flex-col gap-[32px] max-w-[852px]">
        <div className="flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Profile
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            View all your details here.
          </p>
        </div>

        <div className=" w-full max-[852px] h-auto p-[32px]  bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90  border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-center">
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
          <h1 className="text-[26px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            {name}
          </h1>

          <div className="flex gap-[22px] items-center">
            <div className="text-[#4A6CE8] bg-[#292D40] text-[18px] rounded-[10px] p-[10px_14px] flex items-center gap-1 cursor-pointer hover:text-[#4A6CE8]/70 font-[400] font-[Open Sans]">
              <Shield />
              <span>Verified</span>
            </div>
            <button
              type="button"
              className="text-[#AEA8A8] bg-[#312E44] text-[18px] rounded-[10px] p-[10px_14px] flex items-center gap-1 cursor-pointer hover:text-[#FBFBFB] font-[400] font-[Open Sans]"
            >
              <PencilLine color="white" size={16} />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex gap-[10px] items-center text-white text-[18.7px]">
            <Wallet />
            <span>{accNo}</span>
            <Copy />
            <LogOut />
          </div>
        </div>

        <div className="flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Info
          </h1>
         
        </div>
        <div className="gap-[24px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] flex flex-col  w-full lg:flex-row border border-[#FBFBFB1F] p-[23px] rounded-[19px] opacity-100">
          <div className="flex flex-col w-full gap-[24px] ">
            <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Full Name
              </h1>
              <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
                {name}
              </p>
            </div>
             <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Account Number
              </h1>
              <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
                {phoneNo}
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
          <div className="flex flex-col w-full gap-[24px] ">
            <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Email Address
              </h1>
              <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
                {emailAddress}
              </p>
            </div>
             <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Phone Number
              </h1>
              <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
                {phoneNo}
              </p>
            </div>
             <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Location
              </h1>
              <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
                {location}
              </p>
            </div>
          </div>
        </div>
        {registerError && <p className="text-red-500">{registerError}</p>}
      </div>
      {showModal && <BecomeAMerchant onRegister={handleRegister} />}
    </section>
  );
}
