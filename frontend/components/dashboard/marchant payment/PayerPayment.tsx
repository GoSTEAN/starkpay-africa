// PayerPayment.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { RpcProvider, Contract, num } from "starknet";
import QrReader from "react-qr-scanner";
import { useSearchParams } from "next/navigation";

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [
      {
        name: "success",
        type: "core::bool",
      },
    ],
    state_mutability: "external",
  },

  {
    name: "balance_of",
    type: "function",
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [{ name: "balance", type: "core::integer::u256" }],
    state_mutability: "view",
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "decimals", type: "core::integer::u8" }],
    state_mutability: "view",
  },
];

// Token contract addresses (replace with actual Sepolia testnet addresses)
const TOKEN_ADDRESSES: { [key: string]: string } = {
  USDT: "0x<correct_usdt_address>",
  USDC: "0x<correct_usdc_address>",
  STRK: "0x<correct_strk_address>",
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
  const [currency, setCurrency] = useState("USDT");
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showScanner, setShowScanner] = useState(true);

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
      setShowScanner(false); // Hide scanner if pre-filled from URL
    }
  }, [searchParams]);

  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      try {
        // Parse the scanned URL
        const url = new URL(data);
        const params = new URLSearchParams(url.search);
        const scannedRecipient = params.get("recipient");
        const scannedAmount = params.get("amount");
        const scannedCurrency = params.get("currency");

        if (scannedRecipient && scannedAmount && scannedCurrency) {
          setRecipient(scannedRecipient);
          setAmount(scannedAmount);
          setCurrency(scannedCurrency);
          setShowScanner(false); // Hide scanner after successful scan
        } else {
          setError("Invalid QR code data");
        }
      } catch (err) {
        setError("Failed to parse QR code");
      }
    }
  };

  const handleScanError = (err: any) => {
    console.error(err);
    setError("Error scanning QR code");
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

    const parsedAmount = parseFloat(amount);
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

  return (
    <section className="relative z-[99] rounded-[19px] py-[66px] w-full h-full overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px] bg-[#212324]">
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
            <QrReader
              delay={300}
              onError={handleScanError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <p className="text-white">{scanResult}</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <label className="text-white">Recipient</label>
            <input
              type="text"
              value={recipient}
              readOnly
              className="bg-gray-800 text-white p-2 rounded"
            />

            <label className="text-white">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded"
            />

            <label className="text-white">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option>USDT</option>
              <option>USDC</option>
              <option>STRK</option>
            </select>

            <button
              onClick={handlePay}
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        )}
      </div>
    </section>
  );
}


