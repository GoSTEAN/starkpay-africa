import React from "react";

interface SideNavProps {
  tabs: { icon: React.ReactNode; name: string }[];
  activeTab: string;
  setTab: (tab: string) => void;
}

export default function SideNav({ tabs, activeTab, setTab }: SideNavProps) {
  return (
    <div className="lg:w-[200px] min-h-[60px] relative z-10 lg:min-h-[488px] justify-between items-center lg:items-start flex lg:justify-start overflow-x-scroll lg:overflow-hidden lg:flex-col gap-[42px]">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setTab(tab.name)}
          className={`flex flex-none items-center gap-[12px] transform ease-in-out duration-300 w-[49px] hover:w-fit overflow-hidden px-[12px] h-[50px] rounded-full shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]
            ${activeTab === tab.name ? "border-t-[3px] border-[#8F6DF5] w-fit" : ""}`}
            >
          <span>
          {tab.icon} 
          </span>
          <span className=" text-white font-[500] text-[14px] flex flex-none ">
             {tab.name}
            </span>
        </button>
      ))}
    </div>
  );
}
