"use client";

import { useAccount } from "@starknet-react/core";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface RoleCheckerProps {
  contract: any;
}

export default function RoleChecker({ contract }: RoleCheckerProps) {
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);

  const checkUserRole = useCallback(async () => {
    if (!address || !contract || hasChecked) return;
    
    try {
      const result = await contract.call("get_user_role", [address]);
      
      let roleValue;
      if (Array.isArray(result)) {
        roleValue = result[0];
      } else if (typeof result === 'object' && result !== null) {
        roleValue = result.role || result.user_role || result.value || result.result;
      } else {
        roleValue = result;
      }
      
      const userRole = BigInt(roleValue);
      
      if (userRole !== BigInt(0) && pathname !== "/dashboard") {
        router.push("/dashboard");
      }
      
      setHasChecked(true);
    } catch (err) {
      console.error("Error checking user role:", err);
      setHasChecked(true);
    }
  }, [address, contract, hasChecked, pathname, router]);

  useEffect(() => {
    if (address && contract && !hasChecked) {
      checkUserRole();
    }
  }, [address, contract, hasChecked, checkUserRole]);

  return null; // This component doesn't render anything
}