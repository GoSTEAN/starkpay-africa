"use client"

import SideNav from '@/components/dashboard/side-nav'
import { useState, useEffect } from 'react';
import { Home, Users, QrCode, Landmark, History } from "lucide-react";
import MarchantPayment from '@/components/dashboard/marchant payment/marchant-payment';
import TransactionHistory from '@/components/dashboard/transactions.tsx/transaction-history';
import TransactionStatues from '@/components/dashboard/transaction-statues';
import { Notifications } from '@/components/ui/notification';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const tabs = [
    { icon: <Home color="white" size={25} className="stroke-3" />, name: "Home" },
    { icon: <QrCode color="white" size={25} className="stroke-3" />, name: "Marchant pay" },
    { icon: <Users color="white" size={25} className="stroke-3" />, name: "Payment split" },
    { icon: <Landmark color="white" size={25} className="stroke-3" />, name: "NGN withdrawal" },
    { icon: <History color="white" size={25} className="stroke-3" />, name: "Transactions" },
  ];

  const addTransaction = (transaction: any) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const addNotification = (notification: any) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // const markNotificationAsRead = (id: number) => {
  //   setNotifications(prev =>
  //     prev.map(n => n.id === id ? { ...n, read: true } : n)
  //   );
  // };

  // const markAllNotificationsAsRead = () => {
  //   setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  // };

  // const removeNotification = (id: number) => {
  //   setNotifications(prev => prev.filter(n => n.id !== id));
  // };

  // const clearAllNotifications = () => {
  //   setNotifications([]);
  // };

  return (
    <div className='bg-[#212324] w-screen justify-center lg:gap-[50] h-screen flex flex-col lg:flex-row lg:items-center px-3 md:px-[50] lg:px-[200]'>
      <SideNav tabs={tabs} setTab={setActiveTab} activeTab={activeTab} />
      <div className='w-full lg:max-w-[1196px] h-[700px] bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90 rounded-2xl overflow-y-scroll border border-[#FBFBFB1F]'>
        {activeTab === "Marchant pay" && (
          <MarchantPayment 
            walletAddress={walletAddress} 
            onTransaction={addTransaction}
            addNotification={addNotification}
          />
        )}
        {activeTab === "Transactions" && (
          <TransactionHistory transactions={transactions} />
        )}
        {activeTab === "NGN withdrawal" && <TransactionStatues />}
        
        {/* <Notifications
          notifications={notifications}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
          onRemove={removeNotification}
          onClearAll={clearAllNotifications}
        /> */}
      </div>
    </div>
  )
}