"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import useNotifications from "@/components/providers/notification-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { address: walletAddress, status } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { addNotification } = useNotifications();
  const [hasChecked, setHasChecked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Only check if we're on the dashboard route
    if (pathname !== "/dashboard") {
      setHasChecked(true);
      return;
    }

    // Check if disconnected or no wallet address
    if (status === "disconnected" || !walletAddress) {
      if (!hasChecked) {
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
        setShouldRedirect(true);
      }
      setHasChecked(true);
    } else {
      setHasChecked(true);
      setShouldRedirect(false);
    }
  }, [walletAddress, status, pathname, addNotification, hasChecked]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/");
    }
  }, [shouldRedirect, router]);

  // Show loading only on initial check for dashboard
  if (pathname === "/dashboard" && !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-5 border-[#8F6DF5]"></div>
      </div>
    );
  }

  // Allow children to render - useEffect handles redirects
  return <>{children}</>;
}