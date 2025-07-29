import Link from "next/link";
import React from "react";

export default function NavBar() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "How it works", href: "/about" },
    { name: "Privacy", href: "/about" },
    { name: "Languages", href: "/about" },
    { name: "FAQs", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];
  return (
      <div className="fixed top-0 mx-auto left-0 w-full z-[99]  justify-center items-center h-[88px] gap-[50px] flex text-white ">
        <div className="text-[24px] font-[500] text-white">StarkPay</div>
        <div className="w-max-w-[727px] rounded-[30px] justify-between items-center flex gap-[30px] bg-white/10 p-[10px] border-l-[0.1px] border-white">
          {navItems.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="text-[16px] font-[400] font-[Montserrat] px-4"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="py-[10px] px-[31px] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]">
          connect wallet
        </div>
      </div>
  );
}
