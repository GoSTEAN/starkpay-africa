import Image from "next/image";
import React from "react";
import { Ban, Check, Loader, Timer } from "lucide-react";

interface StatusProp {
  type?: string;
  onClickFunc?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  status?: string;
}

export default function StatusState({ type, onClickFunc, status }: StatusProp) {
  const statues = [
    {
      title: "Pending Transaction",
      description: "Your transaction is under review... please wait a moment ",
      icon: <Timer size={100} color="#8F6DF5" className="stroke-3" />,
    },
    {
      title: "Failed Transaction",
      description: "Your transaction failed. Would you like to try again? ",
      icon: <Ban size={100} color="#8F6DF5" className="stroke-3" />,
    },
    {
      title: "Successful Transaction",
      description: "Your transaction was successful!!",
      icon: <Check size={100} color="#8F6DF5" className="stroke-3" />,
    },
  ];

  const stats = statues.map((stat) => stat);

  if (type === "transaction" && status === "pending") {
    return (
      <div className="w-full h-full absolute top-0 left-0 inset-0 bg-transparent backdrop-blur-md flex items-center justify-center">
        <div className="w-full max-w-[356px] h-[367.2px] bg-[#212324] rounded-[22.8px] flex flex-col items-center justify-center gap-[14.4px] p-[38px_24px] border-t-[1.2px] border-l-[1.2px] border-solid border-[#FBFBFB1F] shadow-[inset_0px_8.4px_16.8px_0px_#FFFFFF1C,inset_6px_0px_16.8px_0px_#FFFFFF1C]">
          {stats[0].icon}
          <h1 className="text-[29px] font-[600] text-center font-[Montserrat] text-[#8F6DF5]">
            {stats[0].title}
          </h1>
          <p className="text-[#FBFBFB] text-center font-[Open Sans] text-[19px] font-[400]">
            {stats[0].description}
          </p>
        </div>
      </div>
    );
  }

  if (type === "transaction" && status === "failed") {
    return (
      <div className="w-full h-full absolute top-0 left-0 inset-0 bg-transparent backdrop-blur-md flex items-center justify-center">
        <div className="w-full max-w-[356px] h-[367.2px] bg-[#212324] rounded-[22.8px] flex flex-col items-center justify-center gap-[14.4px] p-[38px_24px] border-t-[1.2px] border-l-[1.2px] border-solid border-[#FBFBFB1F] shadow-[inset_0px_8.4px_16.8px_0px_#FFFFFF1C,inset_6px_0px_16.8px_0px_#FFFFFF1C]">
          {stats[1].icon}
          <h1 className="text-[29px] font-[600] text-center font-[Montserrat] text-[#8F6DF5]">
            {stats[1].title}
          </h1>
          <p className="text-[#FBFBFB] text-center font-[Open Sans] text-[19px] font-[400]">
            {stats[1].description}
          </p>
        </div>
      </div>
    );
  }

  if (type === "transaction" && status === "success") {
    return (
      <div className="w-full h-full absolute top-0 left-0 inset-0 bg-transparent backdrop-blur-md flex items-center justify-center">
        <div className="w-full max-w-[356px] bg-[#212324] h-[367.2px] rounded-[22.8px] flex flex-col items-center justify-center gap-[14.4px] p-[38px_24px] border-t-[1.2px] border-l-[1.2px] border-solid border-[#FBFBFB1F] shadow-[inset_0px_8.4px_16.8px_0px_#FFFFFF1C,inset_6px_0px_16.8px_0px_#FFFFFF1C]">
          {stats[2].icon}
          <h1 className="text-[29px] font-[600] text-center font-[Montserrat] text-[#8F6DF5]">
            {stats[2].title}
          </h1>
          <p className="text-[#FBFBFB] text-center font-[Open Sans] text-[19px] font-[400]">
            {stats[2].description}
          </p>
        </div>
      </div>
    );
  }
  if (type === "confirmation") {
    return (
      <div className="w-full h-full absolute top-0 left-0 inset-0 bg-transparent backdrop-blur-md flex items-center justify-center">
        <div className="w-full max-w-[356px] h-[367.2px] bg-[#212324] rounded-[22.8px] flex flex-col items-center justify-center gap-[14.4px] p-[38px_24px] border-t-[1.2px] border-l-[1.2px] border-solid border-[#FBFBFB1F] shadow-[inset_0px_8.4px_16.8px_0px_#FFFFFF1C,inset_6px_0px_16.8px_0px_#FFFFFF1C]">
          <Loader size={100} color="#8F6DF5" />
          <h1 className="text-[29px] font-[600] text-center font-[Montserrat] text-white/80">
            Confirm Transaction
          </h1>
          <p className="text-[#FBFBFB] text-center font-[Open Sans] text-[19px] font-[400]">
            Are you sure you want to go ahead with this transaction?
          </p>
          <button
            type="button"
            onClick={onClickFunc}
            className="bg-[#FBFBFB12] w-full rounded-[40px] p-[18px_22px] text-[#FBFBFB] text-[20px] font-[600] font-[Open Sans] "
          >
            Yes
          </button>
          <button
            type="button"
            onClick={onClickFunc}
            className="bg-[#FBFBFB12] w-full rounded-[40px] p-[18px_22px] text-[#FF592B] text-[20px] font-[600] font-[Open Sans] "
          >
            No
          </button>
        </div>
      </div>
    );
  }
}
