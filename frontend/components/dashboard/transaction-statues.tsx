import { Ban, Check, Timer } from "lucide-react";
import { title } from "process";
import React from "react";

export default function TransactionStatues() {
  const statues = [
    {
      title: "Pending Transaction",
      description: "Your transaction is under review... please wait a moment ",
      icon: <Timer size={100} color="#8F6DF5" />,
    },
    {
      title: "Failed Transaction",
      description: "Your transaction failed. Would you like to try again? ",
      icon: <Ban size={100} color="#8F6DF5" />,
    },
    {
      title: "Successful Transaction",
      description: "Your transaction was successful!!",
      icon: <Check size={100} color="#8F6DF5" />,
    },
  ];
  
  const status = statues.map(stat => stat)

  return (
    <div className="relative rounded-[19px] z-10 py-[66px] overflow-hidden gap-[22px] flex items-center flex-col justify-between font-[Montserrat] px-[10px] md:px-[32px] bg-transparent">
      <div className="w-full max-w-[356px] h-[367.2px] rounded-[22.8px] flex flex-col items-center justify-center gap-[14.4px] p-[38px_24px] border-t-[1.2px] border-l-[1.2px] border-solid border-[#FBFBFB1F] shadow-[inset_0px_8.4px_16.8px_0px_#FFFFFF1C,inset_6px_0px_16.8px_0px_#FFFFFF1C]">
        {status[0].icon}
        <h1 className="text-[29px] font-[600] text-center font-[Montserrat] text-[#8F6DF5]">
            {status[0].title}
        </h1>
        <p className="text-[#FBFBFB] text-center font-[Open Sans] text-[19px] font-[400]">
        {status[0].description}
        </p>
      </div>
    </div>
  );
}
