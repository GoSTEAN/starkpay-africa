import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";
import { STARKPAY_ABI } from "./useStarkpayContract";

export function useUserRole() {
  const { address } = useAccount();
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const RPC_URL =
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://starknet-mainnet.public.blastapi.io";

  const checkUserRole = async () => {
    if (!address || !contractAddress) {
      setRole(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });
      const contract = new Contract(STARKPAY_ABI, contractAddress, provider);

      const roleNumber = await contract.get_user_role(address);
      setRole(Number(roleNumber));
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError("Failed to fetch user role");
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserRole();
    const interval = setInterval(checkUserRole, 300000);
    return () => clearInterval(interval);
  }, [address]);

  // ✅ Always return the same object shape
  return {
    role,
    isMerchant: role === 1,
    isUser: role === 0,
    loading,
    error,
    refresh: checkUserRole,
  };
}
