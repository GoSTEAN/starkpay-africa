"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import useNotifications from "@/components/providers/notification-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { address: walletAddress, status, isConnected } = useAccount();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      
      // Wait a moment for the connection status to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (status === "disconnected" || !walletAddress) {
        addNotification({
          id: Date.now(),
          type: "error",
          title: "Wallet Not Connected",
          message: "Please connect your Starknet wallet to access the dashboard",
          timestamp: new Date(),
          read: false,
          category: "connection",
          status: "failed",
        });
        router.push("/");
      } else {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [walletAddress, status, router, addNotification]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F6DF5]"></div>
      </div>
    );
  }

  if (status === "disconnected" || !walletAddress) {
    return null;
  }

  return <>{children}</>;
}