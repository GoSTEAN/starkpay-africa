import {
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Copy,
  Eye,
  LogOut,
  PencilLine,
  RotateCcw,
  Shield,
  TriangleAlert,
  User,
  Verified,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useUserRole } from "@/hooks/getUserRole";
import { Contract, RpcProvider } from "starknet";
import BecomeAMerchant from "./become-a-marchant";
import { STARKPAY_ABI as MERCHANT_ABI } from "@/hooks/useStarkpayContract";

const MERCHANT_ADDRESS =
  "0x01f7d31c6f11046029310be2e7810189eb6b4581049b4d35047fbc8e42ab75a4";

export default function DashboardHome() {
  const { account, address } = useAccount();
  const { role, loading, error, isMerchant } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [activeDuration, setActiveDration] = useState("Week");

  const handleDurationChange = (dur: string) => {
    setActiveDration(dur);
  };

  const phoneNo = "1234567890";
  const accNo = "0234567890";
  const name = "Nanzing Moses Tali";
  const emailAddress = "talinanzing111@gmail.com";
  const location = "No 4 Mozambique Barnawa Complex, Kaduna";
  const amount = "12,000,500";
  const balance = "7,098";
  const img = "/user.jpg";
  const recentNames = [
    "Peter Onoja",
    "Susan Simon",
    "Ezikel David",
    "Peace Michael",
    "Jerry Joe",
  ];

  const thead = ["Name", "Amount", "Date", "Status"];
  const duration = ["All", "Week", "Months"];

  const mockData = [
    {
      name: "Progress Ada",
      amount: 400,
      date: "August 11, 2025",
      status: "In progress",
    },
    {
      name: "Chinedu Adebayo",
      amount: 100,
      date: "August 10, 2025",
      status: "Warning",
    },
    {
      name: "Osasogie Bello",
      amount: 60,
      date: "August 10, 2025",
      status: "Done",
    },
    {
      name: "Funmilayo Musa",
      amount: 10,
      date: "August 09, 2025",
      status: "Done",
    },
    {
      name: "Ayodeji Nwosu",
      amount: 300,
      date: "August 09, 2025",
      status: "Warning",
    },
    {
      name: "Zainab Ogunleye",
      amount: 120,
      date: "August 08, 2025",
      status: "In progress",
    },
    {
      name: "Babatunde Abdullahi",
      amount: 1200,
      date: "August 07, 2025",
      status: "In progress",
    },
    {
      name: "Amarachi Yusuf",
      amount: 1100,
      date: "August 06, 2025",
      status: "Warning",
    },
    {
      name: "Omotola Lawal",
      amount: 40,
      date: "August 05, 2025",
      status: "Warning",
    },
  ];

  return (
    <section className="relative rounded-[19px] items-center py-[66px] w-full h-full  bg-[#212324] overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px]">
      <div className="w-full h-full flex flex-col gap-[32px]  overflow-y-scroll">
        <div className="flex flex-col gap-[8px] ">
          <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Dashboard
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            View all your details here.
          </p>
        </div>

        <div className=" w-full max-[852px] h-auto p-[32px]  bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90  border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col">
          <div className="text-[16px] text-[#8F6DF5] flex gap-[8px]">
            <span>Total Balance</span>
            <Eye color="white" />
          </div>
          <div className="text-[38px] text-white font-[600]">
            N<span>{amount}</span>
          </div>

          <div className="flex flex-col gap-[15px] ">
            <h1 className="text-[16px] font-[600] text-[#8F6DF5] font-[Montserrat]">
              Account
            </h1>
            <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {accNo}
            </p>
          </div>
        </div>
        <div className="flex gap-[32px] items-center flex-col lg:flex-row w-full font-[Open Sans]">
          <div className=" rounded-[11px] p-[22px] gap-[12px] border border-[#8F6DF5]/30 flex flex-col w-full ">
            <h1 className="text-[16px] font-[600] text-[white]/70 font-[Montserrat]">
              USDC Balance
            </h1>
            <p className="text-[21px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {balance}
            </p>
          </div>
          <div className=" rounded-[11px] p-[22px] gap-[12px] border border-[#8F6DF5]/30 flex flex-col w-full ">
            <h1 className="text-[16px] font-[600] text-[white]/70 font-[Montserrat]">
              USDT Balance
            </h1>
            <p className="text-[21px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {balance}
            </p>
          </div>
          <div className=" rounded-[11px] p-[22px] border border-[#8F6DF5]/30 gap-[12px] flex flex-col w-full ">
            <h1 className="text-[16px] font-[600] text-[white]/70 font-[Montserrat]">
              STRK Balance
            </h1>
            <p className="text-[21px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {balance}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] pt-9">
          <h1 className="text-[27px] font-[600] pb-9 text-[#8F6DF5] font-[Montserrat]">
            Quick Transfer
          </h1>
          <div className="flex justify-between gap-[24px] items-center">
            {recentNames?.map((name, id) => (
              <div className="flex flex-col overflow-x-scroll items-center justify-center">
                <div className="w-[50px] flex items-center justify-center h-[50px]  overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
                  {img ? (
                    <Image
                      src={img}
                      fill
                      alt="user profile image"
                      className="rotate-[-45deg]"
                    />
                  ) : (
                    <User
                      color="white"
                      size={100}
                      className="rotate-[-45deg]"
                    />
                  )}
                </div>
                <h1
                  key={id}
                  className="text-[14px] w-[50px] text-center font-[400] text-[#8F6DF5] font-[Montserrat]"
                >
                  {name}
                </h1>
              </div>
            ))}
            <ChevronRight className="w-[20px]" color="white" size={30} />
          </div>
          <div className="w-full gap-[6px] mt-5 text-[white] font-[600] font-[Open Sans] flex items-center">
            <button className="bg-[#493E71] w-full py-[30px] rounded-[60px] hover:bg-[#493E71]/80">
              Marchant Payment
            </button>
            <button className="bg-[#493E71] w-full py-[30px] rounded-[60px] hover:bg-[#493E71]/80">
              Swap
            </button>
          </div>

          <div className="flex flex-col w-full mt-10 gap-[25px]">
            <div className="flex justify-between items-center">
              <h1 className="text-[24px] font-[600] pb-9 text-[#8F6DF5] font-[Montserrat]">
                Transactions
              </h1>
              <div className="flex gap-[10px] items-center">
                {duration?.map((dur, id) => (
                  <button
                    key={id}
                    onClick={() => handleDurationChange(dur)}
                    className={`cursor-pointer ${
                      activeDuration === dur
                        ? "text-[#8F6DF5] border-b borderb-[#8F6DF5]"
                        : "text-white hover:text-white/80"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className=" w-full max-[852px] h-auto p-[32px] font-[Open Sans] bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90  border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col">
              <table className="w-full flex flex-col gap-[24px]">
                <thead className="text-[#8F6DF5] font-[400px] font-[Open Sans] flex flex-col gap-[24px] lg:text-[16px] text-[14px] border-b-[1px] border-[#FBFBFB1A]   w-full">
                  <tr className="flex items-center gap-[48px] pb-[16px] ">
                    {thead?.map((td, id) => (
                      <td className={`w-full ${id > 0 ? "lg:w-[30%]" : "w-full"}`} key={id}>
                        {td}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[#FBFBFB] font-[400px] gap-[24px] font-[Open Sans] text-[14px] lg:text-[16px] flex flex-col gap-[24px]  pb-[16px] w-full">
                  {mockData?.map((td, id) => (
                    <tr
                      key={id}
                      className="flex hover:bg-[#FBFBFB1A]/20 transition-all duration-300 items-center gap-[48px]  pb-[5] border-b border-[#FBFBFB1A] "
                    >
                      <td className="w-full flex">
                        <div className="flex overflow-x-scroll gap-[8px] items-center justify-center">
                          <div className="w-[30px] flex items-center justify-center h-[30px]  overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
                            {img ? (
                              <Image
                                src={img}
                                fill
                                alt="user profile image"
                                className="rotate-[-45deg]"
                              />
                            ) : (
                              <User
                                color="white"
                                size={100}
                                className="rotate-[-45deg]"
                              />
                            )}
                          </div>
                          <h1 className="  text-center font-[400] text-[#FBFBFB] font-[Montserrat]">
                            {td.name}
                          </h1>
                        </div>
                      </td>
                      <td className="w-full lg:w-[30%]">${td.amount}</td>
                      <td className="w-full lg:w-[30%]">{td.date}</td>
                      <td className="w-full lg:w-[30%] flex gap-[6px] p-[6px_14px] items-center text-start justify-start bg-[#FBFBFB12] rounded-[30px]"><span>{td.status === "In progress"? <RotateCcw /> : ""}</span> <span>{td.status === "Warning"? <TriangleAlert /> : ""}</span> <span>{td.status === "Done"? <CircleCheck /> : ""}</span><span>{td.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
