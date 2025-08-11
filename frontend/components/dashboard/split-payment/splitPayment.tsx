"use client";

import { Percent, ToggleLeft, Users } from "lucide-react";
import React from "react";
import { useState } from "react";

interface Split {
  address: string;
  amount: string;
  currency: string;
  isPercentage: boolean;
  activeType: "Amount" | "percentage";
}

export default function SplitPayment() {
  const [activeType, setActiveType] = useState<"Amount" | "percentage">(
    "Amount"
  );
  const [currency, setCurrency] = useState("NGN");
  const [toggle, setToggle] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [splits, setSplits] = useState<Split[]>([]);
  const [splitTypeLocked, setSplitTypeLocked] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = () => setToggle(!toggle);

  const handleCurrencySelect = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
    setToggle(false);
  };

  function handleAddSplit() {
    if (!address || !amount) return;

    if (isNaN(parseFloat(amount))) {
      setError("Please enter a valid number");
      return;
    }

    // Check if adding this split would exceed 100% for percentage splits
    if (activeType === "percentage") {
      const newTotal = totalPercentage + parseFloat(amount);
      if (newTotal > 100) {
        setError("Total percentage cannot exceed 100%");

        return;
      }
    }
    const newSplit: Split = {
      address,
      amount,
      currency,
      isPercentage: activeType === "percentage",
      activeType,
    };

    setSplits([...splits, newSplit]);
    setAddress("");
    setAmount("");

    if (splits.length === 0) {
      setSplitTypeLocked(true);
    }

    if (totalPercentage > 100) {
      alert("Total percentage cannot exceed 100%");
      return;
    }
  }

  setTimeout(() => {
    setError("");
  }, 7000);

  // Calculate total allocated amount
  const totalAllocated = splits.reduce((total, split) => {
    if (!split.isPercentage) {
      return total + parseFloat(split.amount) || 0;
    }
    return total;
  }, 0);

  // Calculate total allocated percentage
  const totalPercentage = splits.reduce((total, split) => {
    if (split.isPercentage) {
      return total + parseFloat(split.amount) || 0;
    }
    return total;
  }, 0);
  const currencyType = ["USDT", "NGN", "USDC", "STRK"];
  const hasSplits = splits.length > 0;

  return (
    <section className="relative rounded-[19px] py-[66px] w-full h-full  overflow-y-scroll gap-[22px] flex flex-col  font-[Montserrat] px-[32px] bg-[#212324]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between items-start">
        <div className=" flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600px] text-[#8F6DF5] font-[Montserrat]">
            Payment Split Configuration
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            Set up automatic payment distribution for SMEs (e.g..., owner,
            workers, reserves)
          </p>
        </div>
        <div className=" flex flex-col gap-[8px] w-fit">
          <h1 className="text-white/60">Split type</h1>
          <div className="flex items-center border-[1px] border-white/20 rounded-[8px] ">
            <button
              type="button"
              onClick={() => !splitTypeLocked && setActiveType("Amount")}
              className={`text-[#FBFBFB] text-[16px] font-[600] font-[Open Sans] cursor-pointer hover:bg-[#FBFBFB12]/50 rounded-l-[8px] py-[10px] px-[20px] border-r-[1px] border-white/20 ${
                activeType === "Amount" ? "bg-[#FBFBFB12]/80" : ""
              }`}
            >
              Amount
            </button>
            <button
              type="button"
              onClick={() => !splitTypeLocked && setActiveType("percentage")}
              className={`text-[#FBFBFB] text-[16px] font-[600] font-[Open Sans] cursor-pointer hover:bg-[#FBFBFB12]/50 rounded-l-[8px] py-[10px] px-[20px] border-r-[1px] border-white/20 ${
                activeType === "percentage" ? "bg-[#FBFBFB12]/80" : ""
              }`}
            >
              Percentage
            </button>
          </div>
          {splitTypeLocked && (
            <p className="text-sm text-yellow-400">
              Split type locked to{" "}
              {activeType === "Amount" ? "amounts" : "percentages"} after first
              split
            </p>
          )}
        </div>
      </div>
      <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col  items-center ">
        <div className="w-full rounded-full flex gap-[10px] items-center py-[16px] px-[20px] border-[1px] border-white/20  ">
          <Users color="white" size={20} />
          <p className="text-[14px] text-white font-[400] font-[Open Sans] ">
            Contact platform admin to configure splits. Provide recipient
            addresses and percentage shares (total =100%)
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
              <div className="w-full rounded-[48px] items-center  border-[1px] border-white/20 ">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  id="address"
                  placeholder="0x123..."
                  className="text-[#FBFBFB99]/90 w-full text-[16px] py-[16px] px-[20px] font-[600px] outline-none bg-transparent border-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] w-full">
              <label
                className="text-[#8F6DF5] text-[16px] font-[600] font-[Montserrat]"
                htmlFor="amount"
              >
                {activeType === "Amount" ? "Amount" : "Percentage"}
              </label>
              <div className="w-full relative rounded-[48px] gap-[8px] items-center px-[20px] border-[1px] flex border-white/20 ">
                {activeType === "Amount" && (
                  <div className="relativ">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="text-white/70 cursor-pointer "
                    >
                      {currency}
                    </button>
                    <div
                      className={` ${
                        toggle ? "flex" : "hidden"
                      } flex-col items-start justify-start absolute top-0 left-0 w-[150px] p-3`}
                    >
                      <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
                      {currencyType.map((cur, index) => (
                        <button
                          onClick={() => handleCurrencySelect(cur)}
                          type="button"
                          key={index}
                          className="text-white/70 relative z-10 hover:bg-white/10 w-full "
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  id="amount"
                  placeholder={activeType === "Amount" ? "1000" : "60"}
                  className={`text-[#FBFBFB99]/90 text-[16px] ${
                    activeType === "percentage" ? "w-[30px] " : "w-full"
                  } font-[600px] outline-none bg-transparent border-none py-[16px] `}
                />
                {activeType === "percentage" && (
                  <p className="text-white/70 ">%</p>
                )}
              </div>
            </div>

            {/* Error message display */}
            {error && (
              <div className="w-full text-red-400 text-sm">{error}</div>
            )}

            <button
              type="button"
              onClick={handleAddSplit}
              className="w-full text-[16px] font-[600] font-[Open Sans] text-[#FBFBFB] cursor-pointer bg-[#FBFBFB12] hover:bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] border-[1px]  border-white/20 "
            >
              Add to split
            </button>
          </div>
          <div className="lg:w-[1px] lg:h-full bg-white/20 w-full h-[1px]"></div>
          <div className="w-full">
            {hasSplits ? (
              <>
                <div className="w-full flex flex-col py-[16px] px-[20px] gap-[8px]">
                  <h1 className="flex justify-between items-center text-white/60 text-[16px] font-[600] font-[Open Sans]">
                    <span>Address</span>
                    <span>Amount</span>
                  </h1>
                  {splits.map((split, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b-[1px] border-[white]/30 pb-2 text-white/80 items-center gap-[8px]"
                    >
                      <div className="flex gap-[10px]">
                        <p className="text-white/80 w-fit">{index + 1}</p>
                        <p className="truncate max-w-[200px]">
                          {split.address}
                        </p>
                      </div>
                      <p>
                        {split.amount}{" "}
                        {!split.isPercentage ? split.currency : "%"}
                      </p>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    {totalAllocated > 0 && (
                      <div className="flex justify-between text-white/80">
                        <span>Total Amount:</span>
                        <span>
                          {totalAllocated.toFixed(2)} {currency}
                        </span>
                      </div>
                    )}
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
                  className="w-full text-[16px] font-[600] font-[Open Sans] text-[#FBFBFB] cursor-pointer hover:bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] border-[1px]  border-white/20 "
                >
                  Configure Split(Contact Admin)
                </button>
              </>
            ) : (
              <h1 className="text-[18px] font-[600] text-white/60 w-full text-center">
                Add payment details to display here
              </h1>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
