"use client";

import { useConnect, useDisconnect } from "@starknet-react/core";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { useRouter } from "next/navigation";
import useNotifications from "@/components/providers/notification-provider";
import { useAccount } from "@starknet-react/core";

interface ConnectButtonProps {
  onShowRegister: () => void;
  contract: any;
}

export default function ConnectButton({ onShowRegister, contract }: ConnectButtonProps) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });
  const { address, account } = useAccount();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const connectWallet = async () => {
    try {
      const { connector } = await starknetkitConnectModal();
      if (!connector) return;
      await connect({ connector: connector as any });
      
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

      // Redirect to dashboard after successful connection
      // router.push("/dashboard");
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
            Conn - {address?.slice(0, 4)}...{address?.slice(-2)}
          </div>
        </button>
      )}
    </>
  );
}