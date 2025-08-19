"use client"

import Image from "next/image";
import { features } from "process";
import React from "react";

export default function Values() {
  const items = [
    {
      id: 1,
      icon: "/icons/wallet1.svg",
      title: "Connect Your Wallet",
      description:
        "Set up a Starknet wallet like Argent or Braavos in minutes — no seed phrase needed. Login with email or social accounts thanks to account abstraction. Once connected, your wallet address appears on your dashboard.",
    },
    {
      id: 2,
      icon: "/icons/wallet2.svg",
      title: "Accept Crypto Payments",
      description:
        "Easily receive USDC, USDT, or STRK using QR codes. Enter the amount, generate your QR, and let your customers scan and pay — even offline. Transactions are instant, low-cost, and on-chain.",
    },
    {
      id: 3,
      icon: "/icons/wallet3.svg",
      title: "Withdraw in Naira",
      description:
        "Request NGN withdrawals from your crypto balance. StarkPay simulates off-ramping with real-time NGN conversion and logs every transaction — fast, transparent, and secure.",
    },
  ];

 
  return (
    <div className=" w-full h-auto  flex items-center ">
      <div className="flex w-full flex-col  items-center lg:items-start gap-[24px]">
        <div className="py-[10px] cursor-pointer relative px-[31px] w-fit text-white text-[22px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]">
          How it works
          <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
        </div>
        <h1 className="text-[20px] lg:text-[46px] font-[600] font-[Montserrat] text-[white] text-#FBFBFB">
          From crypto to cash — in just three steps.
        </h1>
        <p className="text-[18px] font-[400] font-[Open Sana] text-[#FBFBFB]">
          {" "}
          Start using StarkPay in minutes — no crypto knowledge required.
        </p>

        <div className="w-full grid grid-cols-12 gap-[20px] justify-between mt-[100px]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col w-full  col-span-12 lg:col-span-6  xl:col-span-4 mx-auto max-w-[400px]  opacity-100 gap-[12px] rounded-[19px]  pt-[16px] pr-[22px] pb-[16px] pl-[22px] border-t border-l border-solid border-[#FBFBFB1F] shadow-[inset_0px_7px_14px_0px_#FFFFFF1C,inset_5px_0px_14px_0px_#FFFFFF1C]"
            >
              <Image src={item.icon} alt={item.title} width={80} height={80} />
              <h1 className="text-[25px] font-[600] text-white">{item.title}</h1>
              <p className="text-white text-[16px] font-[400] font-[Open Sans]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

