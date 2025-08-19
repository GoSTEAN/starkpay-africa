"use client";

import SideNav from "@/components/dashboard/side-nav";
import { useState, useEffect } from "react";
import { Home, Users, QrCode, Landmark, History, ArrowUp } from "lucide-react";
import MarchantPayment from "@/components/dashboard/marchant payment/marchant-payment";
import TransactionHistory from "@/components/dashboard/transactions.tsx/transaction-history";
import TransactionStatues from "@/components/dashboard/status-state";
import { Notifications } from "@/components/ui/notification";
import DashboardHome from "@/components/dashboard/home/home";
import SplitPayment from "@/components/dashboard/split-payment/splitPayment";
import NGNWithdrawal from "@/components/dashboard/withdrawal/NgnWithdrawal";
import StatusState from "@/components/dashboard/status-state";
import TokenSwap from "@/components/dashboard/token-swap";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [Status, setStatus] = useState("");
  const [Type, setType] = useState("");

  const tabs = [
    {
      icon: <Home  size={25} color="white" className="stroke-3" />,
      name: "Home",
    },
    {
      icon: <QrCode  size={25} color="white" className="stroke-3" />,
      name: "Marchant pay",
    },
    {
      icon: <Users  size={25} color="white" className="stroke-3" />,
      name: "Payment split",
    },
     {
      icon: <ArrowUp  size={25} color="white" className="stroke-3" />,
      name: "Swap",
    },
    {
      icon: <Landmark  size={25} color="white" className="stroke-3" />,
      name: "NGN withdrawal",
    },
    {
      icon: <History  size={25} color="white" className="stroke-3" />,
      name: "Transactions",
    },
    
  ];

  const addTransaction = (transaction: any) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const addNotification = (notification: any) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
      setType("");
    }, 5000);
  }, [Status, Type]);

  return (
    <div className=" bg-[#212324] w-screen justify-between lg:gap-[50] relative h-screen flex flex-col lg:flex-row lg:items-center px-3 md:px-[50] lg:px-[200]">
      <SideNav tabs={tabs} setTab={setActiveTab} activeTab={activeTab} />
      <div className="w-full lg:max-w-[1296px] h-[850px] mt-20 items-start dark-bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90 rounded-2xl overflow-y-scroll ">
        {activeTab === "Marchant pay" && (
          <MarchantPayment
            onTransaction={addTransaction}
            addNotification={addNotification}
          />
        )}
        {activeTab === "Transactions" && (
          <TransactionHistory transactions={transactions} />
        )}
        {activeTab === "NGN withdrawal" && (
          <NGNWithdrawal
            triggerStatus={setStatus}
            addNotification={addNotification}
          />
        )}
        {activeTab === "Home" && <DashboardHome />}
        {activeTab === "Payment split" && <SplitPayment />}
        {activeTab === "Swap" && <TokenSwap />}
      </div>
      {/* <div className="absolute  top-0 left-0 w-full h-full z-10">
        <StatusState type={Type} status={Status} />
      </div> */}
    </div>
  );
}
