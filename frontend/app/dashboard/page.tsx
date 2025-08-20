'use client';

import SideNav from '@/components/dashboard/side-nav';
import { useState, useEffect } from 'react';
import {
    Home,
    Users,
    QrCode,
    Landmark,
    History,
    ArrowUpDown,
} from 'lucide-react';
import MarchantPayment from '@/components/dashboard/marchant-payment/marchant-payment';
import TransactionHistory from '@/components/dashboard/transactions.tsx/transaction-history';
import StatusState from '@/components/dashboard/status-state';
import DashboardHome from '@/components/dashboard/home/home';
import SplitPayment from '@/components/dashboard/split-payment/splitPayment';
import NGNWithdrawal from '@/components/dashboard/withdrawal/NgnWithdrawal';
import TokenSwap from '@/components/dashboard/token-swap';
import ProtectedRoute from '@/context/protectedRoute';
import useNotifications from '@/components/providers/notification-provider';
import Notifications from '@/components/ui/notification';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Home');
    const [Status, setStatus] = useState('');
    const [Type, setType] = useState('');
    const {
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
    } = useNotifications();

    const tabs = [
        {
            icon: <Home size={25} color="white" className="stroke-3" />,
            name: 'Home',
        },
        {
            icon: <QrCode size={25} color="white" className="stroke-3" />,
            name: 'Marchant pay',
        },
        {
            icon: <Users size={25} color="white" className="stroke-3" />,
            name: 'Payment split',
        },
        {
            icon: <ArrowUpDown size={25} color="white" className="stroke-3" />,
            name: 'Swap',
        },
        {
            icon: <Landmark size={25} color="white" className="stroke-3" />,
            name: 'NGN withdrawal',
        },
        {
            icon: <History size={25} color="white" className="stroke-3" />,
            name: 'Transactions',
        },
    ];

    const addTransaction = (transaction: any) => {
        addNotification({
            id: Date.now(),
            type: transaction.status === 'success' ? 'success' : 'error',
            title:
                transaction.status === 'success'
                    ? 'Transaction Successful'
                    : 'Transaction Failed',
            message: `Transaction: ${transaction.amount} ${transaction.currency} (${transaction.status})`,
            timestamp: new Date(),
            read: false,
            category: 'transaction',
            status: transaction.status,
        });
    };

    useEffect(() => {
        if (Status && Type) {
            const timer = setTimeout(() => {
                setStatus('');
                setType('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [Status, Type]);

    return (
        <ProtectedRoute>
            <div className="bg-[#212324] w-screen justify-between lg:gap-[50px] relative h-screen flex flex-col lg:flex-row lg:items-center px-3 md:px-[50px] lg:px-[200px]">
                <SideNav
                    tabs={tabs}
                    setTab={setActiveTab}
                    activeTab={activeTab}
                />
                <div className="w-full lg:max-w-[1296px] h-[850px] mt-20 items-start dark-bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90 rounded-2xl overflow-y-scroll">
                    <div className="flex justify-end p-4">
                        <Notifications
                            notifications={notifications}
                            onMarkAsRead={markAsRead}
                            onMarkAllAsRead={markAllAsRead}
                            onRemove={removeNotification}
                            onClearAll={clearAll}
                        />
                    </div>
                    {activeTab === 'Marchant pay' && (
                        <MarchantPayment
                            onTransaction={addTransaction}
                            addNotification={addNotification}
                        />
                    )}
                    {activeTab === 'Transactions' && (
                        <TransactionHistory transactions={notifications} />
                    )}
                    {activeTab === 'NGN withdrawal' && (
                        <NGNWithdrawal
                            triggerStatus={(type, status) => {
                                setType(type);
                                setStatus(status);
                            }}
                            addNotification={addNotification}
                        />
                    )}
                    {activeTab === 'Home' && <DashboardHome />}
                    {activeTab === 'Payment split' && <SplitPayment />}
                    {activeTab === 'Swap' && <TokenSwap />}
                </div>
                {Status && Type && (
                    <div className="absolute top-0 left-0 w-full h-full z-10">
                        <StatusState type={Type} status={Status} />
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
