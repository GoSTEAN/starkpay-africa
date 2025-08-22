"use client";

import { useConnect, useDisconnect } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import useNotifications from "@/components/providers/notification-provider";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

interface ConnectButtonProps {
  onShowRegister: () => void;
  contract: any;
}

export default function ConnectButton({ onShowRegister, contract }: ConnectButtonProps) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile device
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    };
    setIsMobile(checkMobile());
  }, []);

  const connectWallet = async () => {
    try {
      if (isMobile) {
        // Handle mobile connection
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          // Mobile browser with injected provider
          await connect({ connector: connectors[0] });
        } else {
          // Guide user to install mobile wallet
          addNotification({
            id: Date.now(),
            type: "info",
            title: "Install Mobile Wallet",
            message: "Please install Argent Mobile or Braavos app from your app store",
            timestamp: new Date(),
            read: false,
            category: "connection",
            // status: "success",
          });
          
          // Optionally open app store links
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.open('https://apps.apple.com/app/argent/id1358741926', '_blank');
          } else if (/Android/i.test(navigator.userAgent)) {
            window.open('https://play.google.com/store/apps/details?id=im.argent.contractwalletclient', '_blank');
          }
          return;
        }
      } else {
        // Desktop connection
        await connect({ connector: connectors[0] });
      }
      
      addNotification({
        id: Date.now(),
        type: "success",
        title: "Wallet Connected",
        message: "Wallet connected successfully",
        timestamp: new Date(),
        read: false,
        category: "connection",
        status: "completed",
      });

      router.push("/dashboard");
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to connect wallet";
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Connection Failed",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
        category: "connection",
        status: "failed",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
    addNotification({
      id: Date.now(),
      type: "info",
      title: "Wallet Disconnected",
      message: "You have been disconnected from your wallet",
      timestamp: new Date(),
      read: false,
      category: "connection",
      status: "completed",
    });
  };

  return (
    <>
      {!address ? (
        <button
          onClick={connectWallet}
          className="py-[10px] cursor-pointer flex-none relative px-[31px] w-fit text-white text-[18px] font-[500] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
        >
          CONNECT WALLET
          <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
        </button>
      ) : (
        <button
          onClick={handleDisconnect}
          className="py-[10px] cursor-pointer relative px-[31px] w-fit text-white text-[18px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
        >
          <div className="text-white flex flex-none font-[500] text-center sm:text-base transform">
            Disconnect
          </div>
        </button>
      )}
    </>
  );
}