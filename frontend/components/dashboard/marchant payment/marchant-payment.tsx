import { ChevronDown, QrCode, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import QRCodeLib from "qrcode";
import QrCodeComponent from "./qr-code";
import { useMemo } from "react";
import useExchangeRates from "@/hooks/useExchangeRate";
import { useAccount } from "@starknet-react/core";

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
  const [currency, setCurrency] = useState("USDT");
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);

  const currencies = ["USDT", "USD", "STRK", "NGN"] as const;
  const exchangeRates = useExchangeRates();

  const {address: walletAddress, account, status} = useAccount()

  useEffect(() => {
    // Check if rates are loaded
    if (
      exchangeRates.rates.USDT !== null &&
      exchangeRates.rates.USDC !== null &&
      exchangeRates.rates.STRK !== null
    ) {
      setRatesLoading(false);
    }
  }, [exchangeRates]);

  // Check for expired transactions every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPendingTransactions((prev) =>
        prev.map((tx) => {
          const createdAt = new Date(tx.timestamp);
          const minutesElapsed =
            (now.getTime() - createdAt.getTime()) / (1000 * 60);

          if (minutesElapsed >= 30 && tx.status === "pending") {
            // Mark as failed
            const updatedTx = {
              ...tx,
              status: "failed",
              failedAt: now,
            };

            // Add notification
            addNotification({
              id: Date.now(),
              type: "error",
              title: "Transaction Expired",
              message: `QR payment of ${tx.amount} ${tx.currency} has expired`,
              timestamp: now,
              read: false,
              category: "qr_code",
            });

            // Update parent component
            onTransaction(updatedTx);

            return updatedTx;
          }
          return tx;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [addNotification, onTransaction]);

  const handleShowDropDown = () => setShowDropDown(!showDropDown);
  const handleFileChange = (e: string) => setCurrency(e);

  const NGNValue = useMemo(() => {
    if (!amount) return "0";

    // Handle NGN case
    if (currency === "NGN") return Number.parseFloat(amount).toLocaleString();

    // Get the rate for the selected currency
    const rate = exchangeRates[currency as keyof typeof exchangeRates];

    // If rate is not available yet, return "Loading..."
    if (rate === null || rate === undefined) return "Loading...";

    // Calculate and format the value
    return (Number.parseFloat(amount) * Number(rate)).toLocaleString();
  }, [amount, currency, exchangeRates]);
  const generateQR = async () => {
    if (!amount || !currency) return;
    setIsGenerating(true);

    const paymentData = {
      amount: Number.parseFloat(amount),
      currency,
      recipient: walletAddress,
      timestamp: Date.now(),
    };

    try {
      const qrCodeDataURL = await QRCodeLib.toDataURL(
        JSON.stringify(paymentData)
      );

      setQrCode(qrCodeDataURL);
      setToggle(true);
      setHasViewed(false);

      // Create pending transaction
      const transaction = {
        id: Date.now(),
        type: "qr_payment",
        amount: Number.parseFloat(amount),
        currency,
        status: "pending",
        timestamp: new Date(),
        ngnValue: NGNValue,
      };

      setPendingTransactions((prev) => [...prev, transaction]);
      onTransaction(transaction);

      // Add notification
      addNotification({
        id: Date.now(),
        type: "info",
        title: "QR Code Generated",
        message: `Waiting for payment of ${amount} ${currency}`,
        timestamp: new Date(),
        read: false,
        category: "qr_code",
      });

      // Simulate payment success (in real app, this would be from blockchain event)
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate for demo

        if (success) {
          const fee = Number.parseFloat(amount) * 0.005;
          const netAmount = Number.parseFloat(amount) - fee;

          const completedTx = {
            ...transaction,
            status: "completed",
            fee,
            netAmount,
            completedAt: new Date(),
          };

          setPendingTransactions((prev) =>
            prev.filter((tx) => tx.id !== transaction.id)
          );
          onTransaction(completedTx);

          addNotification({
            id: Date.now(),
            type: "success",
            title: "Payment Received",
            message: `Received ${netAmount.toFixed(2)} ${currency} (₦${(
              Number.parseFloat(amount) *
              Number(exchangeRates[currency as keyof typeof exchangeRates] || 0)
            ).toLocaleString()})`,
            timestamp: new Date(),
            read: false,
            category: "payment",
          });
        }
      }, 10000);
    } catch (error) {
      addNotification({
        id: Date.now(),
        type: "error",
        title: "QR Generation Failed",
        message: "Failed to generate payment QR code",
        timestamp: new Date(),
        read: false,
        category: "qr_code",
      });
    }

    setIsGenerating(false);
  };

  return (
    <section className="relative rounded-[19px] py-[66px] h-full overflow-hidden gap-[22px] flex flex-col justify-between font-[Montserrat] px-[32px] bg-transparent">
      <div className="flex flex-col gap-[22px]">
        <h1 className="text-[#8F6DF5] text-[20px] md:text-[30px] lg:text-[41px] font-[600]">
          Generate Payment QR Code
        </h1>
        <p className="text-[#FBFBFB] text-[20px] font-[400]">
          Accepting USDC, USDT, or STRK payments from customers using QR codes
        </p>
      </div>

      <div className="flex flex-col justify-center gap-[36px]">
        <div className="flex flex-col md:flex-row gap-[36px]">
          <div className="flex flex-col gap-[36px] w-full">
            <label
              className="text-[22px] text-[#8F6DF5] font-[600]"
              htmlFor="amount"
            >
              Payment Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="outline-none w-full text-white min-h-[54px] rounded-[28px] border py-[16px] px-[20px] bg-[#8F6DF51A]/10 border-[#8F6DF566]"
            />
          </div>
          <div className="flex flex-col gap-[36px] w-full relative">
            <label
              className="text-[22px] text-[#8F6DF5] font-[600]"
              htmlFor="amount"
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
                onClick={handleShowDropDown}
                className="cursor-pointer hover:bg-white/10 rounded-full"
              >
                <ChevronDown size={25} color="white" />
              </button>
            </div>

            {/* Dropdown */}
            {showDropDown && (
              <div className="w-full flex flex-col absolute top-[100%] py-3 z-10 bg-[#8F6DF51A]/10">
                <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
                {currencies.map((currency, index) => (
                  <button
                    onClick={() => handleFileChange(currency)}
                    key={index}
                    className="w-full relative z-10 px-8 py-3 hover:bg-[#FBFBFB12]/30 text-white text-[16px] font-[400] text-end"
                  >
                    {currency}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {amount && currency && (
          <div className="p-3 bg-transparent -mt-10 rounded-lg">
            <p className="text-sm text-white">
              NGN Equivalent: ₦{ratesLoading ? "Loading..." : NGNValue}
            </p>
            <p className="text-sm text-gray-500">
              Fee (0.5%): {(Number.parseFloat(amount) * 0.005).toFixed(3)}{" "}
              {currency !== "NGN" && (
                <span className="text-xs text-gray-500 mt-1">
                  Current Rate: 1 {currency} = ₦
                  {exchangeRates[
                    currency as keyof typeof exchangeRates
                  ]?.toLocaleString() ?? "Loading..."}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    

      {/* ✅ Show View button only if QR was generated & modal closed */}
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
          onClick={generateQR}
          disabled={!amount || !currency || isGenerating}
          className="flex gap-[10px] hover:bg-[#FBFBFB12]/30 justify-center items-center w-full p-[21px]"
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

      {/* ✅ QR Code Modal */}
      {qrCode && toggle && (
        <div className="absolute top-0 left-0 w-full h-full ">
          <div className="absolute inset-0 bg-transparent backdrop-blur-lg" />
          <QrCodeComponent
            Amount={amount}
            label="shoe payment"
            ngnValue={NGNValue}
            currency={currency}
            settoggle={(value) => {
              setToggle(value);
              if (!value) setHasViewed(true);
            }}
            qrcode={qrCode}
          />
        </div>
      )}
    </section>
  );
}