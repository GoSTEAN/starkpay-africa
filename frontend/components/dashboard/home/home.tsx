import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useAccount } from "@starknet-react/core";

export default function DashboardHome() {
  const { address } = useAccount();

  const img = "/user.jpg";
  return (
    <section className="relative rounded-[19px] py-[66px] w-full h-full  overflow-y-scroll gap-[22px] flex flex-col items-start font-[Montserrat] px-[32px] bg-[#212324]">
      <div className="w-full h-full flex flex-col gap-[32px] max-w-[688px] ">
        <div className=" flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600px] text-[#8F6DF5] font-[Montserrat]">
            Profile
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            View all your details here.
          </p>
        </div>

        <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col  items-center ">
          <h1 className="text-[22px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Tali Nanzing Moses
          </h1>
          <div className="w-[183.75px] flex items-center justify-center h-[183.75px] overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45  border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)] ">
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
            <h1 className="text-[14px] font-[600px] text-[#8F6DF5] font-[Montserrat]">
              Connected Wallet Address
            </h1>
            <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {address ? address : "No wallet connected"}
            </p>
          </div>
          <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
            <h1 className="text-[14px] font-[600px] text-[#8F6DF5] font-[Montserrat]">
              Account Type
            </h1>
            <p className="text-[16px] font-[400] font-[Open Sans] flex justify-between text-[#FBFBFB]/50">
              <span>Marchant...</span>
              <button type="button" className="cursor-pointer">
                <ChevronDown color="white" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
