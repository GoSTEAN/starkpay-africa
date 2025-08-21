"use client";

import { Percent, Users } from "lucide-react";
import React, { useState } from "react";
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core";
import { num } from "starknet";
import Payment from "./payment";
import { STARKPAY_ABI as smeAbi } from "@/hooks/useStarkpayContract";
import { TOKEN_ADDRESSES as tokenAddress } from "autoswap-sdk";

// Define the Split interface
interface Split {
  address: string; 
  amount: string; 
  currency: string;
  isPercentage: boolean;
}

// Token contract addresses (replace with actual Starknet addresses)
const TOKEN_ADDRESSES: { [key: string]: string } = {
  USDT: tokenAddress.USDT,
  USDC: tokenAddress.USDC,
  STRK: tokenAddress.STRK,
};

// Token decimals for u256 conversion
const TOKEN_DECIMALS: { [key: string]: number } = {
  USDT: 6,
  USDC: 6,
  STRK: 18,
};



export default function SplitPayment() {
  const [currency, setCurrency] = useState<string>("STRK");
  const [toggle, setToggle] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [splits, setSplits] = useState<Split[]>([]);
  const [error, setError] = useState<string>("");
  const [togglePayment, setTogglePayment] = useState<boolean>(false);

  // Store transaction hash as proxy for SME ID
  const [smeId, setSmeId] = useState<string | null>(null); 

  const { address: connectedAddress } = useAccount();

  // Contract address
  let smeContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS 
  
  if (!smeContractAddress) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not defined");
  } 
  if (!smeContractAddress.startsWith("0x")) {
  smeContractAddress = `0x${smeContractAddress}`;
}
const typedContractAddress = smeContractAddress as `0x${string}`;
  // Create contract instance
  const { contract } = useContract({
    abi: smeAbi,
    address: typedContractAddress,
  });

  // Hook for sending create_sme3 transaction
  const { sendAsync: sendCreateSme3, error: createError, data: createData } = useSendTransaction({
    calls: undefined,
  });

  // Hook for sending distribute_sme3_payment transaction
  const { sendAsync: sendDistributePayment, error: distributeError } = useSendTransaction({
    calls: undefined,
  });

  const handleToggle = () => setToggle(!toggle);

  const handlePaymentToggle = () => setTogglePayment(!togglePayment);

  const handleCurrencySelect = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
    setToggle(false);
  };

  const handleAddSplit = () => {
    if (!connectedAddress || !amount) {
      setError("Address and percentage are required");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError("Please enter a valid percentage");
      return;
    }

    // Validate percentage: must be u8 (0-255) and integer
    if (parsedAmount < 0 || parsedAmount > 255 || !Number.isInteger(parsedAmount)) {
      setError("Percentage must be an integer between 0 and 255");
      return;
    }

    // Validate splits length
    if (splits.length >= 3) {
      setError("Cannot add more than 3 recipients");
      return;
    }

    // Validate total percentage
    const newTotal = totalPercentage + parsedAmount;
    if (newTotal > 100) {
      setError("Total percentage cannot exceed 100%");
      return;
    }

    // Validate Starknet address
    try {
      num.toHex(address);
    } catch {
      setError("Invalid Starknet address");
      return;
    }

    const newSplit: Split = {
      address,
      amount,
      currency,
      isPercentage: true, 
    };

    setSplits([...splits, newSplit]);
    setAddress("");
    setAmount("");
  };

  const handleConfigureSplit = async () => {
    console.log("address", address, contract)
    // if (!address || !contract) {
    //   setError("Please connect your Starknet wallet and ensure contract is loaded");
    //   return;
    // }

    if (splits.length !== 3) {
      setError("Exactly 3 recipients are required");
      return;
    }

    const totalPercent = totalPercentage;
    if (totalPercent !== 100) {
      setError("Total percentage must equal 100%");
      return;
    }

    try {
      const call = contract?.populate("create_sme3", [
        splits[0].address,
        parseInt(splits[0].amount),
        splits[1].address,
        parseInt(splits[1].amount),
        splits[2].address,
        parseInt(splits[2].amount),
      ]);
      if (!call) {
        setError("Failed to populate contract call for SME creation.");
        return;
      }
      const result = await sendCreateSme3([call]);
      const smeIdHex = result.transaction_hash;
      setSmeId(smeIdHex);
      setError("");
      alert(`SME configuration created successfully! Transaction Hash: ${smeIdHex}`);
      setTogglePayment(true); // Automatically open the payment component
    } catch (err) {
      setError("Failed to create SME configuration: " + (err as Error).message);
    }
  };

  const handleConfirmPayment = async (totalAmount: string, currencyToSend: string) => {
    if (!connectedAddress) {
      setError("Please connect your Starknet wallet and ensure contract is loaded");
      return;
    }

    if (!smeId) {
      setError("No SME configuration found. Please configure splits first.");
      return;
    }

    const parsedAmount = parseFloat(totalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount to distribute");
      return;
    }

    const tokenAddress = TOKEN_ADDRESSES[currencyToSend];
    if (!tokenAddress) {
      setError("Invalid token selected");
      return;
    }

    // Convert totalAmount to u256 with decimals
    const decimals = TOKEN_DECIMALS[currencyToSend] || 18;
    const amountBN = BigInt(Math.floor(parsedAmount * (10 ** decimals)));
    const low = (amountBN & (BigInt(Math.pow(2, 128)) - BigInt(1))).toString();
    const high = (amountBN >> BigInt(128)).toString();

    try {
      // Approve call
      const approveCall = {
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: [smeContractAddress, low, high],
      };

      // Distribute call
      const distributeCall = {
        contractAddress: smeContractAddress,
        entrypoint: "distribute_sme3_payment",
        calldata: [low, high, tokenAddress],
      };

      await sendDistributePayment([approveCall, distributeCall]);
      setTogglePayment(false);
      setSplits([]);
      setSmeId(null);
      setError("");
      alert("Payment distributed successfully!");
    } catch (err) {
      setError("Failed to distribute payment: " + (err as Error).message);
    }
  };

  setTimeout(() => {
    setError("");
  }, 7000);

  // Calculate total allocated percentage
  const totalPercentage: number = splits.reduce((total: number, split: Split) => {
    return total + parseFloat(split.amount) || 0;
  }, 0);

  const currencyType: string[] = ["USDT", "USDC", "STRK"]; 
  const hasSplits: boolean = splits.length > 0;

  return (
    <section className="relative rounded-[19px] py-[66px] w-full h-full  overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat]  bg-[#212324]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between items-start">
        <div className="flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600px] text-[#8F6DF5] font-[Montserrat]">
            Payment Split Configuration
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            Set up automatic payment distribution for SMEs (e.g., owner, workers, reserves)
          </p>
          {smeId && (
            <p className="text-[14px] font-[400] font-[Open Sans] text-[#8F6DF5]">
              Transaction Hash: {smeId}
            </p>
          )}
        </div>
      </div>
      <div className="w-full h-full p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-center">
        <div className="w-full rounded-full flex gap-[10px] items-center py-[16px] px-[20px] border-[1px] border-white/20">
          <Users color="white" size={20} />
          <p className="text-[14px] text-white font-[400] font-[Open Sans]">
            Configure exactly 3 recipient addresses with percentages totaling 100%
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="flex flex-col w-full items-center gap-6">
            <div className="flex flex-col gap-[8px] w-full">
              <label
                className="text-[#8F6DF5] text-[16px] font-[600] font-[Montserrat]"
                htmlFor="address"
              >
                Address
              </label>
              <div className="w-full rounded-[48px] items-center border-[1px] border-white/20">
                <input
                  type="text"
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                  id="address"
                  placeholder="0x123..."
                  className="text-[#FBFBFB99]/90 w-full text-[16px] py-[16px] px-[20px] font-[600px] outline-none bg-transparent border-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] w-full">
              <label
                className="text-[#8F6DF5] text-[16px] font-[600] font-[Montserrat]"
                htmlFor="currency"
              >
                Currency
              </label>
              <div className="w-full relative rounded-[48px] gap-[8px] items-center px-[20px] border-[1px] flex border-white/20">
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-white/70 cursor-pointer  py-[16px] px-[20px]"
                >
                  {currency}
                </button>
                <div
                  className={`${
                    toggle ? "flex" : "hidden"
                  } flex-col items-start justify-start absolute top-0 left-0 w-[150px] p-3`}
                >
                  <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
                  {currencyType.map((cur: string, index: number) => (
                    <button
                      onClick={() => handleCurrencySelect(cur)}
                      type="button"
                      key={index}
                      className="text-white/70 relative z-10 hover:bg-white/10 w-full"
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[8px] w-full">
              <label
                className="text-[#8F6DF5] text-[16px] font-[600] font-[Montserrat]"
                htmlFor="amount"
              >
                Percentage
              </label>
              <div className="w-full relative rounded-[48px] gap-[8px] items-center px-[20px] border-[1px] flex border-white/20">
                <input
                  type="text"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  id="amount"
                  placeholder="60"
                  className="text-[#FBFBFB99]/90 text-[16px] w-[30px] font-[600px] outline-none bg-transparent border-none py-[16px]"
                />
                <p className="text-white/70">%</p>
              </div>
            </div>

            {/* Error message display */}
            {error && (
              <div className="w-full text-red-400 text-sm">{error}</div>
            )}

            <button
              type="button"
              onClick={handleAddSplit}
              className="w-full text-[16px] font-[600] font-[Open Sans] text-[#FBFBFB] cursor-pointer bg-[#FBFBFB12] hover:bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] border-[1px] border-white/20"
            >
              Add to split
            </button>
          </div>
          <div className="lg:w-[1px] lg:h-full bg-white/20 w-full h-[1px]"></div>

          {/* Payment details display */}
          <div className="w-full relative">
            {hasSplits ? (
              <>
                <div className="w-full flex flex-col py-[16px] px-[20px] gap-[8px]">
                  <h1 className="flex justify-between items-center text-white/60 text-[16px] font-[600] font-[Open Sans]">
                    <span>Address</span>
                    <span>Percentage</span>
                  </h1>
                  {splits.map((split: Split, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between border-b-[1px] border-[white]/30 pb-2 text-white/80 items-center gap-[8px]"
                    >
                      <div className="flex gap-[10px]">
                        <p className="text-white/80 w-fit">{index + 1}</p>
                        <p className="truncate max-w-[200px]">{split.address}</p>
                      </div>
                      <p>{split.amount}%</p>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    {totalPercentage > 0 && (
                      <div className="flex justify-between text-white/80">
                        <span>Total Percentage:</span>
                        <span>{totalPercentage.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfigureSplit}
                  className="w-full text-[16px] font-[600] font-[Open Sans] text-[#FBFBFB] cursor-pointer hover:bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] border-[1px] border-white/20"
                >
                  Configure Split
                </button>
              </>
            ) : (
              <h1 className="text-[18px] font-[600] text-white/60 w-full text-center">
                Add payment details to display here
              </h1>
            )}
          </div>
          <Payment
            splits={splits}
            toggle={togglePayment}
            close={handlePaymentToggle}
            totalPercentage={totalPercentage}
            initialCurrency={currency}
            onConfirm={handleConfirmPayment}
          />
        </div>
      </div>
    </section>
  );
}