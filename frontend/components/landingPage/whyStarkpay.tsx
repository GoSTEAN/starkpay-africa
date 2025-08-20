"use client";

import Image from "next/image";
import { features } from "process";
import React from "react";

export default function WhyStarkpay() {
  const items = [
    {
      id: 1,
      icon: "/icons/Gauge.svg",
      title: "Built on Starknet for low fees & high speed",
      description:
        "Set up a Starknet wallet like Argent or Braavos in minutes — no seed phrase needed.",
      color: (
        <div className="w-[94px] h-[16px] absolute -top-2 bg-[#017BFC] opacity-100 shadow-[0_0_1.4px_#3C94EC,0_0_2.8px_#3C94EC,0_0_9.8px_#3C94EC,0_0_19.6px_#3C94EC,0_0_33.6px_#3C94EC,0_0_58.8px_#3C94EC]"></div>
      ),
    },
    {
      id: 2,
      icon: "/icons/Gauge.svg",
      title: "Designed for Nigeria-first use",
      description:
        "Set up a Starknet wallet like Argent or Braavos in minutes — no seed phrase needed.",
      color: (
        <div className="w-[94px] h-[16px] absolute -top-2 bg-[#D4B02D]  opacity-100 shadow-[0_0_5.64px_#D4B02D,0_0_11.28px_#D4B02D,0_0_39.48px_#D4B02D,0_0_78.96px_#D4B02D,0_0_135.36px_#D4B02D,0_0_236.88px_#D4B02D]"></div>
      ),
    },
    {
      id: 3,
      icon: "/icons/Gauge.svg",
      title: "Real-time alerts & reports",
      description:
        "Set up a Starknet wallet like Argent or Braavos in minutes — no seed phrase needed.",
      color: (
        <div className="w-[94px] h-[16px] absolute -top-2 bg-[#8F6DF580] opacity-100 shadow-[0_0_5.64px_#8F6DF5,0_0_11.28px_#8F6DF5,0_0_39.48px_#8F6DF5,0_0_78.96px_#8F6DF5,0_0_135.36px_#8F6DF5,0_0_236.88px_#8F6DF5]"></div>
      ),
    },
    {
      id: 4,
      icon: "/icons/Gauge.svg",
      title: "Support for stablecoins and STRK",
      description:
        "Set up a Starknet wallet like Argent or Braavos in minutes — no seed phrase needed.",
      color: (
        <div className="w-[94px] h-[16px] absolute -top-2 bg-[#00C1B6] opacity-100 shadow-[0_0_5.64px_#00C1B6,0_0_11.28px_#00C1B6,0_0_39.48px_#00C1B6,0_0_78.96px_#00C1B6,0_0_135.36px_#00C1B6,0_0_236.88px_#00C1B6]"></div>
      ),
    },
  ];

  return (
    <div className="relative w-full bg-cover bg-no-repeat justify-center h-auto flex flex-col items-center ">
        <div className="flex w-full flex-col z-10 gap-[24px]  my-auto align-middle h-full">
        <div className="py-[10px] cursor-pointer relative px-[31px] w-fit text-white text-[22px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]">
          Value Propositions
          <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
        </div>
        <h1 className="text-[20px] lg:text-[46px] font-[600] bg-[linear-gradient(90deg,#FBFBFB_0%,#8F6DF5_39.42%,#FBFBFB_93.75%)] bg-clip-text text-transparent font-[Montserrat] text-#FBFBFB">
          From crypto to cash — in just three steps.
        </h1>
        <p className="text-[18px] font-[400] font-[Open Sana] text-[#FBFBFB]">
          {" "}
          Start using Swift in minutes — no crypto knowledge required.
        </p>

        <div className="w-full grid grid-cols-12 gap-[20px] justify-between mt-[100px]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex relative flex-col items-center w-full  col-span-12 lg:col-span-6 min-h-[306px]  xl:col-span-3 mx-auto max-w-[400px]  opacity-100 gap-[12px] rounded-[19px]  pt-[16px] pr-[20px] pb-[30px] pl-[22px] border-t border-l border-solid border-[#FBFBFB1F] shadow-[inset_0px_7px_14px_0px_#FFFFFF1C,inset_5px_0px_14px_0px_#FFFFFF1C] "
            >
              <Image src={item.icon} alt={item.title} width={80} height={80} />
              <h1 className="text-[25px] font-[600] text-center text-white">
                {item.title}
              </h1>
              <p className="text-white  text-center text-[16px] font-[400] font-[Open Sans]">
                {item.description}
              </p>
              {item.color}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
