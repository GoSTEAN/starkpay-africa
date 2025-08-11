import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { WalletConnectorModal } from "../providers/wallet-connector";

export default function Profile() {
  const [toggle, setToggle] = useState(false)

  const accNo = "8101842464";
  const verified = true;

  const handleToggle = () => {
    setToggle(!toggle)
  }
  return (
    <div className="w-full max-w-fit flex  justify-center h-[62.75px] opacity-100 relative pt-[19px] pr-[12px] pb-[19px] pl-[12px] gap-[8px] rounded-[60px] bg-transparent shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]">
      <div className="flex items-center gap-[8px]">
        {verified ? (
          <>
            <span className="text-[#8F6DF5] text-16px font-[400] flex flex-none">
              verified
            </span>
            <ShieldCheck color="#8F6DF5" size={25} />
            <p className="text-[18px]">{accNo}</p>
          </>
        ) : (
          <>
            <span className="text-[red] text-16px font-[400] flex flex-none">
              Not verified
            </span>
            <ShieldCheck color="red" size={25} />
          </>
        )}
      </div>

      <div className="flex items-center gap-[8px] relative">
        <div className="w-[50px] h-[50px] rounded-[70px] border-[1px] overflow-hidden border-[#8F6DF58C]/55 relative">
          <Image src={"/user.jpg"} alt="user profile image" fill />
        </div>
        <button onClick={handleToggle} type="button" className="cursor-pointer">
          <ChevronDown color="white" size={20} />
        </button>
        <div
          className={`absolute top-10 -right-4 ${toggle ? "flex" : "hidden"} bg-transparent  rounded-md p-[20px_10px] border-[#8F6DF58C] border-[0px_1px_1px_1px]`}
        >
          <WalletConnectorModal />
        </div>
      </div>
    </div>
  );
}
