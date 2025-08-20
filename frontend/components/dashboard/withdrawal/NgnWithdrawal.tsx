"use client";

import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import useExchangeRates from "@/hooks/useExchangeRate";
import useGetBalance from "@/hooks/useGetBalance";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { STARKPAY_ABI as smeAbi } from "@/hooks/useStarkpayContract";
import StatusState from "@/components/dashboard/status-state";
import { num } from "starknet";
import { TOKEN_ADDRESSES } from "autoswap-sdk";

interface NGNWithdrawalProps {
  triggerStatus: (type: string, status: string) => void;
  addNotification: (notification: any) => void;
}

export default function NGNWithdrawal({
  triggerStatus,
  addNotification,
}: NGNWithdrawalProps) {
  const [currency, setCurrency] = useState("USDT");
  const [toggle, setToggle] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userImg = "/user.jpg";
  const accountNumber = "8101842464";
  const bankName = "Opay";
  const holdersName = "Tali Nanzing Moses";
  const currencyType = ["USDT", "USDC", "STRK"];
  const exchangeRates = useExchangeRates();
  const {
    balances,
    loading: balanceLoading,
    error: balanceError,
    refetch,
  } = useGetBalance();
  const { address: walletAddress } = useAccount();

  // Contract address
  let smeContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!smeContractAddress) {
    throw new Error("Contract address is not defined in environment variables");
  }
  if (!smeContractAddress.startsWith("0x")) {
    smeContractAddress = `0x${smeContractAddress}`;
  }
  const typedSmeContractAddress = smeContractAddress as `0x${string}`;

  const { contract } = useContract({
    abi: smeAbi,
    address: typedSmeContractAddress,
  });

  const {
    sendAsync: sendWithdraw,
    error: withdrawError,
    data: withdrawData,
  } = useSendTransaction({
    calls: undefined,
  });

  useEffect(() => {
    if (withdrawError) {
      setError(`Withdrawal error: ${withdrawError.message}`);
      triggerStatus("transaction", "failed");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Withdrawal Failed",
        message: `Withdrawal request failed: ${withdrawError.message}`,
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "failed",
      });
      setIsProcessing(false);
      setShowConfirmation(false);
    }
  }, [withdrawError, addNotification, triggerStatus]);

  const handleToggle = () => setToggle(!toggle);

  const handleCurrencySelect = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
    setToggle(false);
  };

  const nairaEquivalent = useMemo(() => {
    if (!amount) return "0";
    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount)) return "0";
    const rate =
      exchangeRates.rates[currency as keyof typeof exchangeRates.rates];
    if (rate === null || rate === undefined) return "Loading...";
    return (parsedAmount * Number(rate)).toLocaleString();
  }, [amount, currency, exchangeRates]);

  const fee = useMemo(() => {
    if (!amount) return "0.0";
    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount)) return "0.0";
    return (parsedAmount * 0.005).toFixed(3);
  }, [amount]);

  const receiveAmount = useMemo(() => {
    if (!amount) return "0";
    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount)) return "0";
    const rate =
      exchangeRates.rates[currency as keyof typeof exchangeRates.rates];
    if (rate === null || rate === undefined) return "Loading...";
    return (
      (parsedAmount - parsedAmount * 0.005) *
      Number(rate)
    ).toLocaleString();
  }, [amount, currency, exchangeRates]);

  const handleWithdrawal = async () => {
    if (!walletAddress) {
      setError("Please connect your Starknet wallet");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your Starknet wallet to proceed",
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "failed",
      });
      return;
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid withdrawal amount");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Invalid Amount",
        message: "Please enter a valid withdrawal amount",
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "failed",
      });
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    const balance = Number.parseFloat(
      balances[currency as keyof typeof balances]
    );
    if (parsedAmount > balance) {
      setError("Withdrawal amount exceeds available balance");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Insufficient Balance",
        message: `Withdrawal amount (${parsedAmount} ${currency}) exceeds available balance (${balance} ${currency})`,
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "failed",
      });
      return;
    }

    if (!contract) {
      setError("Contract not initialized");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Contract Error",
        message:
          "Contract not initialized. Please check contract address and ABI",
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "failed",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmWithdrawal = async () => {
    setIsProcessing(true);
    triggerStatus("transaction", "pending");
    setError(null);

    try {
      const parsedAmount = Number.parseFloat(amount);
      const decimals = { USDT: 6, USDC: 6, STRK: 18 }[currency];
      const amountBN = BigInt(
        Math.floor(parsedAmount * 10 ** (decimals ? decimals : 0))
      );
      const TWO = BigInt(2);
      const ONE = BigInt(1);
      const BIT128 = TWO ** BigInt(128);
      const MASK = BIT128 - ONE;
      const amountU256 = {
        low: (amountBN & MASK).toString(),
        high: (amountBN >> BigInt(128)).toString(),
      };
if(!contract){
  console.log("contract not found")
  return
}
      const call = contract.populate("withdraw_to_bank", [
        walletAddress,
        amountU256,
        {
          USDT: `${TOKEN_ADDRESSES.USDT}`,
          USDC: `${TOKEN_ADDRESSES.USDC}`,
          STRK: `${TOKEN_ADDRESSES.STRK}`,
        }[currency],
        accountNumber,
        bankName,
        holdersName,
      ]);

      const result = await sendWithdraw([call]);
      if (!result?.transaction_hash) {
        throw new Error("Withdrawal failed: No transaction hash returned");
      }

      triggerStatus("transaction", "success");
      addNotification({
        id: Date.now(),
        type: "success",
        title: "Withdrawal Successful",
        message: `Successfully withdrew ${amount} ${currency} to ${bankName} (Tx: ${result.transaction_hash.slice(
          0,
          8
        )}...)`,
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "completed",
      });
      setAmount("");
      refetch();
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Withdrawal request failed";
      setError(errorMessage);
      triggerStatus("transaction", "failed");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Withdrawal Failed",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
        status: "failed",
      });
    } finally {
      setIsProcessing(false);
      setShowConfirmation(false);
    }
  };

  return (
    <section className="relative rounded-[19px] py-[66px] text-white/80 w-full h-full overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px] bg-background">
      <div className="flex flex-col gap-[8px] pb-[24px]">
        <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
          NGN Withdrawal Request
        </h1>
        <p className="text-[16px] font-[400] font-[Open Sans] text-foreground">
          Withdraw funds to your bank account in NGN
        </p>
        {!walletAddress && (
          <p className="text-red-500 text-sm">
            Please connect your Starknet wallet to proceed
          </p>
        )}
      </div>

      <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-start">
        {accountNumber && bankName ? (
          <div className="flex flex-col gap-[16px]">
            <h1 className="text-[16px] font-[600] text-[#8F6DF5] font-[Montserrat]">
              Account Details
            </h1>
            <div className="py-[16px] gap-[12px] px-[20px] rounded-[16px] border-[1px] border-[#8F6DF533] flex items-start w-fit">
              <div className="w-[55px] h-[55px] flex items-center justify-center relative rounded-full overflow-hidden bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
                {userImg ? (
                  <Image
                    className="rotate-[-45deg]"
                    src={userImg}
                    fill
                    alt="user image"
                  />
                ) : (
                  <User className="rotate-[-45deg]" color="white" size={40} />
                )}
              </div>

              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[10px] items-center w-full justify-between">
                  <h1 className="text-[22px] font-[Inter] font-[500] text-foreground">
                    {accountNumber}
                  </h1>
                  <span className="py-[4px] px-[10px] rounded-[72px] text-[#3EAE1E] font-medium border-[0.7px] border-[#FBFBFB1A]">
                    NGN
                  </span>
                </div>
                <div className="flex gap-[10px] items-center w-full justify-between">
                  <h1 className="text-[16px] font-[Inter] font-[500] text-foreground">
                    {bankName}
                  </h1>
                  <button className="p-[5px] cursor-pointer hover:bg-white/10 rounded-[72px] text-[#3EAE1E] font-medium border-[0.7px] border-[#FBFBFB1A]">
                    <ChevronDown color="white" size={20} />
                  </button>
                </div>
                <div className="flex gap-[10px] items-center w-full justify-between">
                  <h1 className="text-[18px] font-[Inter] font-[500] text-foreground">
                    {holdersName}
                  </h1>
                </div>
              </div>
            </div>
            <p className="text-foreground">
              Balance:{" "}
              {balanceLoading
                ? "Loading..."
                : balances[currency as keyof typeof balances]}{" "}
              {currency}
              {balanceError && (
                <span className="text-red-500"> ({balanceError})</span>
              )}
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-[16px] font-[600] text-[#8F6DF5] font-[Montserrat]">
              No account details found
            </h1>
            <p className="text-[14px] font-[400] font-[Open Sans] text-foreground/50">
              Please add your bank account details to proceed with NGN
              withdrawal.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex flex-col gap-[18px] w-full">
            <h1 className="text-foreground">Account</h1>
            <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px]">
              <div className="flex flex-col gap-[16px]">
                <h1 className="opacity-50 text-foreground">From</h1>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-foreground/90 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-pointer"
                  >
                    {currency}{" "}
                    <ChevronDown
                      color="currentColor"
                      size={20}
                      className="border rounded-full"
                    />
                  </button>
                  {toggle && (
                    <div className="flex flex-col items-start justify-start absolute top-full left-0 w-[150px] p-3 z-10 bg-[#312E4266] border-[2px] border-[#8F6DF533] rounded-[12px]">
                      {currencyType.map((cur, index) => (
                        <button
                          key={index}
                          onClick={() => handleCurrencySelect(cur)}
                          type="button"
                          className="text-foreground/70 relative z-10 hover:bg-white/10 w-full text-left p-2"
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-[16px]">
                <div className="flex text-foreground/90 text-[18px] font-[500] items-center gap-[10px]">
                  <span>Available Balance: </span>
                  <span>
                    {balanceLoading
                      ? "Loading..."
                      : balances[currency as keyof typeof balances]}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="--"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px]">
              <div className="flex flex-col gap-[16px]">
                <h1 className="opacity-50 text-foreground">To</h1>
                <div className="relative">
                  <button
                    type="button"
                    className="text-foreground/90 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-default"
                    disabled
                  >
                    NGN
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-[16px]">
                <div className="flex text-foreground/90 text-[18px] font-[500] items-center gap-[10px]">
                  <span>Naira Equivalent</span>
                </div>
                <input
                  type="text"
                  placeholder="--"
                  disabled
                  value={nairaEquivalent}
                  className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px]">
              <div className="flex flex-col gap-[16px]">
                <h1 className="opacity-50 text-foreground">Fees</h1>
                <div className="relative">
                  <button
                    type="button"
                    className="text-foreground opacity-50 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-default"
                    disabled
                  >
                    Receive
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-[16px]">
                <input
                  type="text"
                  placeholder="0.0"
                  disabled
                  value={`${fee} ${currency}`}
                  className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                />
                <div className="flex text-foreground/90 text-[18px] font-[500] items-center gap-[10px]">
                  <input
                    type="text"
                    placeholder="--"
                    disabled
                    value={`${receiveAmount} NGN`}
                    className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="button"
              onClick={handleWithdrawal}
              disabled={isProcessing || !amount || balanceLoading}
              className="w-full text-[16px] font-[600] font-[Open Sans] text-foreground/60 cursor-pointer bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] hover:bg-[#8F6DF5]/20 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Request Withdrawal"}
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <StatusState
          type="confirmation"
          onConfirm={confirmWithdrawal}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </section>
  );
}
