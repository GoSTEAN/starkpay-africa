import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  placeholder,
  func,
}: {
  placeholder: string;
  func: () => void;
}) {
  return (
    <div className="max-w-[407px] min-w-[250px] w-full flex itmes-center  relative h-[62.75px] text-18px font-[400] opacity-100 pt-[19px] pb-[19px] pl-[22px] gap-[16px] rounded-[60px] bg-transparent shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]">
      <Search size={20} className="text-[#FBFBFBB2]/70" />
      <input
        className=" placeholder:text-[#FBFBFBB2]/70 outline-none border-none w-full "
        type="text"
        placeholder={placeholder}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            func();
          }
        }}
      />
    </div>
  );
}
