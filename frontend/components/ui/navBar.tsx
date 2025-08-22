"use client";

import { Bell, Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import WalletConnectorModal from "@/components/providers/wallet-connector";
import SearchBar from "./search";
import Profile from "./profile";
import Notifications from "./notification";
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import useNotifications from "../providers/notification-provider";
import ConnectWallet from "@/components/providers/wallet-connector";
// import ThemeToggle from "./theme-button";

export default function NavBar() {
  const [toggle, setToggle] = React.useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "FAQs", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const { address: isLogedin } = useAccount();

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleSearch = () => {
    console.log("Search function triggered");
  };

  return (
    <div
      className={`fixed top-0 mx-auto left-0 w-full z-[99] justify-between md:justify-between ${
        isLogedin ? "lg:px-[100] xl:px-[200]" : "lg:px-[200px]"
      } items-center h-[88px] lg:gap-[20px] xl:gap-[50px] flex text-white`}
    >
      <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
      <div className="text-[24px] relative z-10 flex   font-[500] text-white">
        {isLogedin ? (
          "Dashboard"
        ) : (
          <Image
            src={"/swiftLogo.svg"}
            alt="swift logo"
            width={100}
            height={100}
          />
        )}
      </div>

      {isLogedin ? (
        <div className="hidden lg:flex gap-[8] items-center w-full justify-end">
          <SearchBar
            placeholder="Search transaction ID..."
            func={handleSearch}
          />
          <Notifications
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onRemove={removeNotification}
            onClearAll={clearAll}
          />
          <Profile />

          {/* <ThemeToggle />  */}
        </div>
      ) : (
        <div
          className={`w-fit hidden lg:flex rounded-[30px] flex-none relative backdrop:blur-md items-center bg-white/10 p-[10px] border-l-[0.1px] mx-auto border-white`}
        >
          <div className="absolute inset-0 rounded-[30px] bg-white/10 backdrop-blur-lg pointer-events-none" />
          {navItems.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="text-[20px] relative z-10 font-[500] hover:bg-white/20 font-[Montserrat] px-4 flex flex-none"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      <div className="z-10 absolute right-8  lg:hidden flex gap-5 items-center">
        <div className="lg:hidden flex items-center justify-center">
          <Notifications
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onRemove={removeNotification}
            onClearAll={clearAll}
          />
        </div>

        <button
          className={`z-[99] ${toggle ? "hidden" : "flex"} lg:hidden`}
          onClick={handleToggle}
        >
          <Menu color="white" size={30} />
        </button>
      </div>
      <div
        className={`flex w-fit gap-8 items-center pr-3 ${
          isLogedin ? "hidden" : "flex"
        }`}
      >
        <div className={` hidden lg:flex`}>
          <WalletConnectorModal />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="flex w-full absolute z-10 lg:hidden left-0 top-0">
        <div className={`w-full ${toggle ? "flex" : "hidden"} justify-start`}>
          <div className="relative md:flex w-full items-center bg-white/10 p-[10px] border-b-[0.1px] border-white overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none" />
            <div className="flex items-center gap-[50px] md:flex-col w-full px-4">
              <div className="text-[24px] relative font-[500]relative z-10 flex text-white">
                <Image
                  src={"/swiftLogo.svg"}
                  alt="swift logo"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-4 top-3 z-[99]"
            >
              <X color="white" size={25} />
            </button>

            {isLogedin ? (
              <div className="flex flex-col md:flex-row gap-[20] items-start md:items-center mt-10">
                <Profile />
                <SearchBar
                  placeholder="Search transaction ID..."
                  func={handleSearch}
                />

              </div>
            ) : (
              <div className="relative z-10 flex flex-col w-full items-start">
                {navItems.map((item, index) => (
                  <Link
                    href={item.href}
                    key={index}
                    className="text-[16px] w-full font-[400] rounded-[30px] hover:bg-white/20 font-[Montserrat] py-2 px-4 flex flex-none"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="flex w-full justify-end mt-2">
                  <ConnectWallet />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
