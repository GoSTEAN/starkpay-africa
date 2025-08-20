"use client";

import { Bell, Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import WalletConnectorModal from "@/components/providers/wallet-connector"
import SearchBar from "./search";
import Profile from "./profile";
import Notifications from "./notification";
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
// import ThemeToggle from "./theme-button";

export default function NavBar() {
  const [toggle, setToggle] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const navItems = [
    { name: "Home", href: "/" },
    { name: "How it works", href: "/about" },
    { name: "Privacy", href: "/about" },
    { name: "FAQs", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  const { address: isLogedin  } = useAccount();
  

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleSearch = () => {
    console.log("Search function triggered");
  };

  // Function to add a notification (you can call this from other components)
  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // Function to mark notification as read
  const markNotificationAsRead = (id: number | string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)
    ))
  };

  // Function to remove notification
  const removeNotification = (id: number | string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div
      className={`fixed top-0 mx-auto left-0 w-full z-[99] justify-between md:justify-between ${
        isLogedin ? "lg:px-[100] xl:px-[200]" : "lg:px-[200px]"
      } items-center h-[88px] lg:gap-[20px] xl:gap-[50px] flex text-white`}
    >
      <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
      <div className="text-[24px] relative z-10 flex   font-[500] text-white">
        {isLogedin ? "Dashboard" : <Image src={"/swiftLogo.svg"} alt="swift logo" width={100} height={100} />}
      </div>
      
      {isLogedin ? (
        <div className="hidden lg:flex gap-[8] items-center w-full justify-end">
          <SearchBar
            placeholder="Search transaction ID..."
            func={handleSearch}
          />
          <Notifications
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllAsRead}
            onRemove={removeNotification}
            onClearAll={clearAllNotifications}
          />
          <Profile />
          
          {/* <ThemeToggle />  */}
        </div>
      ) : (
        <div
          className={`w-fit hidden md:flex rounded-[30px] flex-none relative backdrop:blur-md items-center bg-white/10 p-[10px] border-l-[0.1px] mx-auto border-white`}
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
      
      <div className="z-10 flex gap-5 items-center">
        <div className="lg:hidden flex items-center justify-center">
          <button 
            className="relative"
            onClick={() => setToggle(!toggle)}
          >
            <Bell className="h-5 w-5 text-[#8F6DF5]" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>

        <button
          className={`z-[99] ${toggle ? "hidden" : "flex"} lg:hidden`}
          onClick={handleToggle}
        >
          <Menu color="white" size={30} />
        </button>

        
      </div>
      <div className={`flex w-fit gap-8 items-center pr-3 ${isLogedin?  "hidden" : "flex"}`}>
        <div className={` hidden md:flex`}>
          <WalletConnectorModal />
        </div>

        {/* Mobile Notification Button */}
      </div>

      {/* Mobile Menu */}
      <div className="flex w-full absolute z-10 md:hidden left-0 top-0">
        <div className={`w-full ${toggle ? "flex" : "hidden"} justify-start`}>
          <div className="relative md:flex w-full items-center bg-white/10 p-[10px] border-b-[0.1px] border-white overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none" />
            <div className="flex items-center gap-[50px] md:flex-col w-full px-4">
              <div className="text-[24px] relative font-[500]relative z-10 flex text-white">
                <Image src={"/swiftLogo.svg"} alt="swift logo" width={100} height={100} />
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
              <div className="flex flex-col gap-[20] items-center mt-10">
                <Profile />
                <SearchBar
                  placeholder="Search transaction ID..."
                  func={handleSearch}
                />

                <div className="flex justify-evenly items-center gap-[8] w-full">
                  
                  {/* Mobile Notifications Dropdown */}
                  <div className="relative">
                    <button className="relative">
                      <Bell className="h-5 w-5 text-[#8F6DF5]" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                          {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </button>
                    
                    {/* Mobile Notifications List */}
                    {notifications.length > 0 && (
                      <div className="absolute right-0 mt-2 w-72 bg-[#212324] rounded-lg shadow-lg border border-[#8F6DF5]/20 z-50">
                        <div className="p-3 border-b border-[#8F6DF5]/20">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white font-medium">Notifications</h3>
                            <button 
                              onClick={markAllAsRead}
                              className="text-[#8F6DF5] text-sm"
                            >
                              Mark all as read
                            </button>
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.slice(0, 5).map(notification => (
                            <div 
                              key={notification.id} 
                              className={`p-3 border-b border-[#8F6DF5]/10 ${!notification.read ? 'bg-[#8F6DF5]/10' : ''}`}
                            >
                              <div className="flex justify-between">
                                <p className="text-white text-sm">{notification.title}</p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-[#8F6DF5] rounded-full"></span>
                                )}
                              </div>
                              <p className="text-[#8F6DF5] text-xs mt-1">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 text-center">
                          <button 
                            onClick={() => {
                              // Here you would navigate to the full notifications page
                              // or expand the dropdown to show all
                            }}
                            className="text-[#8F6DF5] text-sm"
                          >
                            View all notifications
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                  <button
                    type="button"
                    className="py-[10px] px-[20px] lg:px-[31px] flex-none flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
                  >
                    connect wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

    // <div>
    //   <Link href="/about">about</Link>
    //   <Link href="/sec">sec</Link>
    // </div>