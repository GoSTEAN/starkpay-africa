"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "@starknet-react/core";
import { RpcProvider, Contract } from "starknet";
import { useSearchParams } from "next/navigation";
import { TOKEN_ADDRESSES as tokenAddress } from "autoswap-sdk";
import { STARKPAY_ABI as ERC20_ABI } from "@/hooks/useStarkpayContract";
import { Html5QrcodeScanner } from "html5-qrcode/cjs/html5-qrcode-scanner.js";
// Token contract addresses
const TOKEN_ADDRESSES: { [key: string]: string } = {
  USDT: tokenAddress.USDT,
  USDC: tokenAddress.USDC,
  STRK: tokenAddress.STRK,
};

// Token decimals
const TOKEN_DECIMALS: { [key: string]: number } = {
  USDT: 6,
  USDC: 6,
  STRK: 18,
};

export default function PayerPayment() {
  const { account, address } = useAccount();
  const searchParams = useSearchParams();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("STRK");
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showScanner, setShowScanner] = useState(true);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScannerInitialized, setIsScannerInitialized] = useState(false);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  useEffect(() => {
    // Check for query params from external scan
    const queryRecipient = searchParams.get("recipient");
    const queryAmount = searchParams.get("amount");
    const queryCurrency = searchParams.get("currency");

    if (queryRecipient && queryAmount && queryCurrency) {
      setRecipient(queryRecipient);
      setAmount(queryAmount);
      setCurrency(queryCurrency);
      setShowScanner(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showScanner || !scannerContainerRef.current) return;

    const initializeScanner = async () => {
      try {
        if (scannerRef.current) {
          // Clean up previous scanner if it exists
          try {
            await scannerRef.current.clear();
          } catch (cleanupError) {
            console.log("Cleanup error:", cleanupError);
          }
        }

        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          false
        );

        scannerRef.current.render(
          (decodedText: string) => {
            handleScan(decodedText);
          },
          (errorMessage: string) => {
            // Don't show errors for normal operation like no QR code found
            if (!errorMessage.includes("No MultiFormat Readers")) {
              console.log("QR Scanner info:", errorMessage);
            }
          }
        );

        setIsScannerInitialized(true);
        setScannerError(null);
      } catch (err) {
        console.error("Failed to initialize QR scanner:", err);
        setScannerError(
          "Failed to initialize QR scanner. Please check camera permissions."
        );
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch((err: any) => {
            console.log("Scanner cleanup error:", err);
          });
        } catch (err) {
          console.log("Error during scanner cleanup:", err);
        }
      }
    };
  }, [showScanner]);

  const handleScan = (data: string) => {
    if (!data || data.trim() === "") {
      return;
    }

    setScanResult(data);
    try {
      if (!data.startsWith("http://") && !data.startsWith("https://")) {
        setError("QR code must contain a valid URL");
        return;
      }

      const url = new URL(data);
      const params = new URLSearchParams(url.search);
      const scannedRecipient = params.get("recipient");
      const scannedAmount = params.get("amount");
      const scannedCurrency = params.get("currency");

      if (scannedRecipient && scannedAmount && scannedCurrency) {
        setRecipient(scannedRecipient);
        setAmount(scannedAmount);
        setCurrency(scannedCurrency);
        setShowScanner(false);
        setScannerError(null);
        setError("");

        if (scannerRef.current) {
          try {
            scannerRef.current.clear().catch(console.error);
          } catch (err) {
            console.log("Error stopping scanner:", err);
          }
        }
      } else {
        setError("Invalid QR code: missing required payment parameters");
      }
    } catch (err) {
      console.error("QR parsing error:", err);
      setError("Failed to parse QR code - invalid URL format");
    }
  };

  const handlePay = async () => {
    if (!account || !address) {
      setError("Please connect your Starknet wallet");
      return;
    }

    if (!recipient || !amount || !currency) {
      setError("Please fill all fields");
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Invalid amount");
      return;
    }

    const tokenAddress = TOKEN_ADDRESSES[currency];
    if (!tokenAddress) {
      setError("Invalid currency");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const tokenContract = new Contract(ERC20_ABI, tokenAddress, provider);
      tokenContract.connect(account);

      const decimals = TOKEN_DECIMALS[currency];
      const amountWei = BigInt(Math.floor(parsedAmount * 10 ** decimals));

      const call = tokenContract.populate("transfer", [recipient, amountWei]);

      const result = await account.execute(call);
      await provider.waitForTransaction(result.transaction_hash);

      setSuccess(`Payment successful! Tx hash: ${result.transaction_hash}`);
    } catch (err: any) {
      setError(`Payment failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const restartScanner = () => {
    setShowScanner(true);
    setScannerError(null);
    setError("");
    setScanResult("");
  };

  const useManualInput = () => {
    setShowScanner(false);
    setScannerError(null);
    setRecipient("");
    setAmount("");
    setCurrency("STRK");
  };

  return (
    <section className="relative  rounded-[19px] py-[66px] max-w-[800px] max-h-[800px] border border-white/10 z-10 text-white w-full h-full overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px] bg-[#212324]">
      <div className="flex flex-col gap-[8px] pb-[24px]">
        <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
          Scan and Pay
        </h1>
        <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
          Scan a merchant QR code to make a payment.
        </p>
      </div>

      <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-start">
        {showScanner ? (
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-white text-lg">Scan QR Code</h2>
            {scannerError && (
              <div className="text-red-500 p-2 bg-red-500/10 rounded mb-4">
                <p className="mb-2">{scannerError}</p>
                <div className="flex gap-2">
                  <button
                    onClick={restartScanner}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={useManualInput}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Enter Manually
                  </button>
                </div>
              </div>
            )}

            {!isScannerInitialized && !scannerError && (
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-white">
                Initializing QR scanner...
              </div>
            )}

            <div
              ref={scannerContainerRef}
              id="qr-reader"
              className="w-full"
              style={{ minHeight: "256px" }}
            />

            <p className="text-white text-sm mt-4">
              Point your camera at a merchant's QR code
            </p>

            <button
              onClick={useManualInput}
              className="mt-4 px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 self-start"
            >
              Enter Payment Details Manually
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg">Payment Details</h3>
              <button
                onClick={restartScanner}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Scan QR Code
              </button>
            </div>

            <label className="text-white">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient address"
              className="outline-none w-full text-white min-h-[54px] rounded-[28px] border py-[16px] px-[20px] bg-[#8F6DF51A]/10 border-[#8F6DF566]"
            />

            <label className="text-white">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="outline-none w-full text-white min-h-[54px] rounded-[28px] border py-[16px] px-[20px] bg-[#8F6DF51A]/10 border-[#8F6DF566]"
            />

            <label className="text-white">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#8F6DF51A]/10 text-white  py-[16px] px-[20px] rounded-xl  border border-gray-600"
            >
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="STRK">STRK</option>
            </select>

            <div className="w-full  flex justify-between">
              <div className="w-full">
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className="min-w-[150px] z-10 text-[16px] font-[600] font-[Open Sans] text-[#FBFBFB] cursor-pointer bg-[#FBFBFB12] hover:bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[14px] px-[22px] border-[1px] border-white/20"
              >
                {loading ? "Processing..." : "Pay"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
