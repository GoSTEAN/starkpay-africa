"use client";

import type React from "react";

import { ChevronDown, QrCode, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import QRCodeLib from "qrcode";
import QrCodeComponent from "./qr-code";
import { useMemo } from "react";
import useExchangeRates from "@/hooks/useExchangeRate";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { RpcProvider } from "starknet";
import { STARKPAY_ABI as paymentAbi } from "@/hooks/useStarkpayContract";

// Token contract addresses
const TOKEN_ADDRESSES: { [key: string]: string } = {
  USDT: "0x068f5c6a61730768477ced7eef7680a434a851905eeff58ee8ba2115ada38e3",
  USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
};

// Token decimals for u256 conversion
const TOKEN_DECIMALS: { [key: string]: number } = {
  USDT: 6,
  USDC: 6,
  STRK: 18,
};

interface MerchantPaymentProps {
  onTransaction: (transaction: any) => void;
  addNotification: (notification: any) => void;
}

export default function MarchantPayment({
  onTransaction,
  addNotification,
}: MerchantPaymentProps) {
  const [toggle, setToggle] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("STRK");
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const currencies = ["USDT", "USDC", "STRK"] as const;
  const exchangeRates = useExchangeRates();
  const { address: walletAddress, status } = useAccount();
  // const { balances, loading: balanceLoading, error: balanceError } = useGetBalance();

  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  // Contract address
  let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address is not defined in environment variables");
  }
  if (!contractAddress.startsWith("0x")) {
    contractAddress = `0x${contractAddress}`;
  }

  // Create contract instance
  const { contract } = useContract({
    abi: paymentAbi,
    address: contractAddress as `0x${string}`,
  });

  // Hook for sending create_payment transaction
  const {
    sendAsync: sendCreatePayment,
    error: createError,
    data: createData,
  } = useSendTransaction({
    calls: undefined,
  });

  useEffect(() => {
    if (createError) {
      setError(`Transaction error: ${createError.message}`);
      setTransactionStatus("failed");
    }
  }, [createError]);

  // Poll for transaction status
  useEffect(() => {
    if (!contract || !pendingTransactions.length) return;

    const interval = setInterval(async () => {
      const now = new Date();

      for (const tx of pendingTransactions) {
        if (tx.status !== "pending") continue;

        const createdAt = new Date(tx.timestamp);
        const minutesElapsed =
          (now.getTime() - createdAt.getTime()) / (1000 * 60);

        // Check if transaction expired (30 minutes)
        if (minutesElapsed >= 30) {
          const updatedTx = {
            ...tx,
            status: "failed",
            failedAt: now,
            expired: true,
          };

          setPendingTransactions((prev) =>
            prev.map((t) => (t.id === tx.id ? updatedTx : t))
          );

          // Only update status if this is the current transaction
          if (transactionData?.id === tx.id) {
            setTransactionStatus("failed");
          }

          addNotification({
            id: Date.now(),
            type: "error",
            title: "Transaction Expired",
            message: `QR payment of ${tx.amount} ${tx.currency} has expired`,
            timestamp: now,
            read: false,
            category: "qr_code",
          });

          onTransaction(updatedTx);
          continue;
        }

        // Check payment status via contract
        try {
          const paymentStatus = await contract.call("get_payment_status", [
            tx.paymentId,
          ]);
          const statusValue = paymentStatus.toString();

          if (statusValue === "1") {
            // Success
            const updatedTx = {
              ...tx,
              status: "success",
              completedAt: now,
            };

            setPendingTransactions((prev) =>
              prev.map((t) => (t.id === tx.id ? updatedTx : t))
            );

            // Only update status if this is the current transaction
            if (transactionData?.id === tx.id) {
              setTransactionStatus("success");
            }

            addNotification({
              id: Date.now(),
              type: "success",
              title: "Payment Successful",
              message: `Received ${tx.amount} ${
                tx.currency
              } (Tx: ${tx.transactionHash.slice(0, 8)}...)`,
              timestamp: now,
              read: false,
              category: "qr_code",
            });

            onTransaction(updatedTx);
          } else if (statusValue === "2") {
            // Failed
            const updatedTx = {
              ...tx,
              status: "failed",
              failedAt: now,
            };

            setPendingTransactions((prev) =>
              prev.map((t) => (t.id === tx.id ? updatedTx : t))
            );

            // Only update status if this is the current transaction
            if (transactionData?.id === tx.id) {
              setTransactionStatus("failed");
            }

            addNotification({
              id: Date.now(),
              type: "error",
              title: "Payment Failed",
              message: `QR payment of ${tx.amount} ${tx.currency} failed`,
              timestamp: now,
              read: false,
              category: "qr_code",
            });

            onTransaction(updatedTx);
          }
        } catch (err) {
          console.error("Error checking payment status:", err);
        }
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [
    contract,
    pendingTransactions,
    addNotification,
    onTransaction,
    transactionData,
  ]);

  const handleShowDropDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDropDown(!showDropDown);
  };

  const handleFileChange = (e: string, event: React.MouseEvent) => {
    event.preventDefault();
    setCurrency(e);
    setShowDropDown(false);
  };

  const currencyValue = useMemo(() => {
    if (!amount) return "0";
    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount)) return "0";
    const rate =
      exchangeRates.rates[currency as keyof typeof exchangeRates.rates];
    if (rate === null || rate === undefined) return "Loading...";
    return (parsedAmount * Number(rate)).toLocaleString();
  }, [amount, currency, exchangeRates]);

  const generateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Validate inputs
      const parsedAmount = Number.parseFloat(amount);
      if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Please enter a valid positive amount");
      }

      if (!currency || !TOKEN_ADDRESSES[currency]) {
        throw new Error("Please select a valid currency");
      }

      if (!walletAddress) {
        throw new Error("Please connect your Starknet wallet");
      }

      if (!contract) {
        throw new Error(
          "Contract not initialized. Please check contract address and ABI"
        );
      }

      setIsGenerating(true);
      setError(null);
      setTransactionStatus("pending");

      // Convert amount to u256
      const decimals = TOKEN_DECIMALS[currency];
      const amountBN = BigInt(Math.floor(parsedAmount * 10 ** decimals));
      const TWO = BigInt(2);
      const ONE = BigInt(1);
      const BIT128 = TWO ** BigInt(128);
      const MASK = BIT128 - ONE;
      const amountU256 = {
        low: (amountBN & MASK).toString(),
        high: (amountBN >> BigInt(128)).toString(),
      };

      // Prepare contract call
      const call = contract.populate("create_payment", [
        walletAddress, // receiver
        amountU256, // amount (u256)
        TOKEN_ADDRESSES[currency], // token
        "Payment for goods/services", // remarks
      ]);

      // Send transaction
      const result = await sendCreatePayment([call]);
      if (!result?.transaction_hash) {
        throw new Error("Transaction failed: No transaction hash returned");
      }

      const transactionHash = result.transaction_hash;
      const paymentId = createData?.toString() || Date.now().toString();

      // Create payment data for QR code
      const paymentData = {
        recipient: walletAddress,
        amount: amount,
        currency: currency,
        paymentId: paymentId,
      };

      const baseUrl = `${window.location.origin}/pay`;
      const queryString = new URLSearchParams(paymentData).toString();
      const fullUrl = `${baseUrl}?${queryString}`;
      const qrCodeDataURL = await QRCodeLib.toDataURL(fullUrl);

      // Create transaction object
      const transaction = {
        id: Date.now(),
        type: "qr_payment",
        amount: parsedAmount,
        currency,
        status: "pending",
        timestamp: new Date(),
        ngnValue: currencyValue,
        transactionHash: transactionHash,
        paymentId: paymentId,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        qrCodeData: qrCodeDataURL, 
      };

      // Update state
      setQrCode(qrCodeDataURL);
      setQrModalOpen(true);
      setHasViewed(false);
      setTransactionData(transaction);
      setPendingTransactions((prev) => [...prev, transaction]);

      // Call parent callbacks
      onTransaction(transaction);
      addNotification({
        id: Date.now(),
        type: "success",
        title: "QR Code Generated",
        message: `Waiting for payment of ${amount} ${currency} (Tx: ${transactionHash.slice(
          0,
          8
        )}...)`,
        timestamp: new Date(),
        read: false,
        category: "qr_code",
      });
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Failed to generate QR code";
      console.error("QR generation error:", err);
      setError(errorMessage);
      setTransactionStatus("failed");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Error Generating QR",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
        category: "qr_code",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const viewQRFromHistory = (transaction: any) => {
    if (transaction.type === "qr_payment" && transaction.qrCodeData) {
      const now = new Date();
      const expiresAt = new Date(transaction.expiresAt);

      if (now < expiresAt || transaction.status === "success") {
        setQrCode(transaction.qrCodeData);
        setTransactionData(transaction);
        setTransactionStatus(transaction.status);
        setQrModalOpen(true);
      }
    }
  };

  return (
    <div className="relative rounded-[19px] py-[66px] h-full overflow-y-scroll gap-[22px] flex flex-col justify-between font-[Montserrat] px-[32px] bg-transparent">
      <div className="flex flex-col gap-[22px]">
        <h1 className="text-[#8F6DF5] text-[20px] md:text-[30px] lg:text-[41px] font-[600]">
          Generate Payment QR Code
        </h1>
        <p className="text-[#FBFBFB] text-[20px] font-[400]">
          Accepting USDC, USDT, or STRK payments from customers using QR codes
        </p>
        {!walletAddress && (
          <p className="text-red-500 text-sm">
            Please connect your Starknet wallet to proceed
          </p>
        )}
      </div>

      <div className="flex flex-col justify-center gap-[36px]">
        <div className="flex flex-col  gap-[36px]">
          <div className="flex flex-col gap-[36px] w-full">
            <label
              className="text-[22px] text-[#8F6DF5] font-[600]"
              htmlFor="amount"
            >
              Payment Amount
            </label>
            <div className="flex w-full justify-between items-center rounded-[28px] min-h-[54px]  border py-[16px] px-[20px] bg-[#8F6DF51A]/10 border-[#8F6DF566]">
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="outline-none w-full text-white "
            />
            <p className="flex gap-[8px] text-white/90 items-center">
              <span>{currency}</span>
              <span>
                {exchangeRates.rates[currency as keyof typeof exchangeRates.rates]
                ? currencyValue
                : "Loading..."}
              </span>
            </p>
            </div>
          </div>
          <div className="flex flex-col gap-[36px] w-full relative">
            <label
              className="text-[22px] text-[#8F6DF5] font-[600]"
              htmlFor="currency"
            >
              Currency
            </label>
            <div className="rounded-[28px] flex justify-between items-center border py-[16px] px-[20px] bg-[#8F6DF51A]/10 border-[#8F6DF566]">
              <input
                type="text"
                value={currency}
                className="text-white outline-none bg-transparent border-none"
                disabled
              />
              <button
                type="button"
                onClick={handleShowDropDown}
                className="cursor-pointer hover:bg-white/10 rounded-full"
              >
                <ChevronDown size={25} color="white" />
              </button>
            </div>
            {showDropDown && (
              <div className="w-full flex flex-col absolute top-[100%] py-3 z-10 bg-[#8F6DF51A]/10">
                <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
                {currencies.map((currencyOption, index) => (
                  <button
                    type="button"
                    onClick={(e) => handleFileChange(currencyOption, e)}
                    key={index}
                    className="w-full relative z-10 px-8 py-3 hover:bg-[#FBFBFB12]/30 text-white text-[16px] font-[400] text-end"
                  >
                    {currencyOption}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {amount && currency && (
          <div className="p-3 bg-transparent -mt-10 rounded-lg">
           
            <p className="text-sm text-gray-500">
              Fee (0.5%):{" "}
              {(Number.parseFloat(amount || "0") * 0.005).toFixed(3)} {currency}
              {currency !== "NGN" && (
                <span className="text-xs text-gray-500 mt-1">
                  {" Current Rate: 1 "}
                  {currency}
                  {" = ₦"}
                  {exchangeRates.rates[
                    currency as keyof typeof exchangeRates.rates
                  ]?.toLocaleString() ?? "Loading..."}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">
          {error}
        </div>
      )}

      {qrCode && hasViewed && !toggle && (
        <button
          type="button"
          onClick={() => setToggle(true)}
          className="absolute right-4 top-3 px-[12px] h-[50px] flex items-center gap-2 rounded-full shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)] text-white z-[99]"
        >
          View
          <Eye color="white" size={20} />
        </button>
      )}

      <div className="w-full rounded-[10px] bg-[#FBFBFB12]/40">
        <button
          type="button"
          onClick={generateQR}
          disabled={!amount || !currency || isGenerating}
          className={`flex gap-[10px] justify-center items-center w-full p-[21px] ${
            !amount || !currency || isGenerating
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#FBFBFB12]/30"
          }`}
        >
          <QrCode color="#FBFBFB" size={40} />
          <span className="text-[20px] font-[600] text-[#FBFBFB]">
            {isGenerating ? "Generating..." : "Generate Payment QR"}
          </span>
        </button>
      </div>

      <div className="w-full text-[#FBFBFB] text-[16px] font-[400] flex justify-start gap-[12px]">
        <span>Transaction fee:</span>
        <span>0.5%</span>
      </div>

      {qrModalOpen && qrCode && (
        <div className="absolute top-0 left-0 w-full h-full ">
          <div className="absolute inset-0 bg-transparent backdrop-blur-lg" />
          <QrCodeComponent
            Amount={transactionData?.amount || amount}
            label="Payment for goods/services"
            ngnValue={transactionData?.ngnValue || currencyValue}
            currency={transactionData?.currency || currency}
            transactionHash={transactionData?.transactionHash}
            paymentId={transactionData?.paymentId}
            transactionStatus={transactionStatus}
            settoggle={(value) => {
              setQrModalOpen(value);
              if (!value) {
                setHasViewed(true);
                setTransactionStatus(null);
              }
            }}
            qrcode={qrCode}
          />
        </div>
      )}
    </div>
  );
}
