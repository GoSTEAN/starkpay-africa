"use client";

import { X } from "lucide-react";
import { useState } from "react";

// Define the Split interface
interface Split {
  address: string; // Starknet ContractAddress
  amount: string; // String for input, parsed to u8 for percentages
  currency: string;
  isPercentage: boolean;
}

// Define props for the Payment component
interface PaymentProps {
  splits: Split[];
  totalPercentage: number;
  toggle: boolean;
  close: () => void;
  initialCurrency: string;
  onConfirm: (totalAmount: string, currency: string) => void; // Callback for distribution
}

export default function Payment({
  splits,
  totalPercentage,
  toggle,
  close,
  initialCurrency,
  onConfirm,
}: PaymentProps) {
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [currencyToSend, setCurrencyToSend] = useState<string>(initialCurrency);
  const [Toggle, setToggle] = useState<boolean>(false);

  const handleCurrencyToggle = () => {
    setToggle(!Toggle);
  };

  const handleAmountToSend = (currencyToSend: string) => {
    setCurrencyToSend(currencyToSend);
    setToggle(false);
  };

  const currencyType: string[] = ["USDT", "USDC", "STRK"]; // Removed NGN

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const percentageAmount: number[] = splits.map((split: Split) => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      return 0; // Return 0 if totalAmount is invalid
    }
    return (amount * parseFloat(split.amount)) / 100;
  });

  const handleConfirm = () => {
    if (!totalAmount || isNaN(parseFloat(totalAmount))) {
      alert("Please enter a valid amount to distribute");
      return;
    }
    onConfirm(totalAmount, currencyToSend);
  };

  return (
    <div
      className={`w-full h-full bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] p-[23px] flex-col ${
        toggle ? "flex" : "hidden"
      } rounded-[19px] opacity-100 absolute top-0 left-0 z-10`}
    >
      <div className="absolute w-full h-full inset-0 bg-transparent backdrop-blur-xl pointer-events-none" />
      <button
        onClick={close}
        type="button"
        className="absolute z-10 top-3 right-10 w-fit h-fit p-2 rounded-full border cursor-pointer text-white/80 hover:text-red-500/60 border-[white]/50"
      >
        <X />
      </button>
      <div className="w-full h-full z-10 mt-10 flex flex-col py-[16px] px-[20px] gap-[8px]">
        <h1 className="flex justify-between items-center text-white/60 text-[16px] font-[600] font-[Open Sans]">
          <span className="w-[40%]">Address</span>
          <span className="w-[30%]">Percentage</span>
          <span className="w-[30%]">Receives</span>
        </h1>
        {splits.map((split: Split, index: number) => (
          <div
            key={index}
            className="flex justify-between text-[18px] font-[500] border-b-[1px] border-[white]/30 pb-2 text-white/80 items-center gap-[8px]"
          >
            <div className="flex gap-[10px] w-[40%]">
              <p className="text-white/80 w-fit">{index + 1}</p>
              <p className="truncate max-w-[200px]">{split.address}</p>
            </div>
            <p className="w-[30%]">{split.amount}%</p>
            <p className="w-[30%]">
              {formatNumber(percentageAmount[index])} {currencyToSend}
            </p>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-white/20">
          {totalPercentage > 0 && (
            <div className="flex justify-between text-white/80">
              <span>Total Percentage:</span>
              <span>{formatNumber(totalPercentage)}%</span>
            </div>
          )}
          {totalAmount && !isNaN(parseFloat(totalAmount)) && (
            <div className="flex justify-between text-white/80">
              <span>Distributed Amounts:</span>
              <span>
                {formatNumber(
                  percentageAmount.reduce((sum: number, val: number) => sum + val, 0)
                )}{" "}
                {currencyToSend}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex z-10 flex-col gap-[8px] w-full">
        <label
          className="text-[#8F6DF5] text-[16px] font-[600] font-[Montserrat]"
          htmlFor="amount"
        >
          Amount to distribute
        </label>
        <div className="w-full relative rounded-[48px] gap-[8px] items-center px-[20px] border-[1px] flex border-white/20">
          <div className="relative">
            <button
              type="button"
              onClick={handleCurrencyToggle}
              className="text-white/70 cursor-pointer"
            >
              {currencyToSend}
            </button>
            <div
              className={`${
                Toggle ? "flex" : "hidden"
              } flex-col items-start justify-start z-[99] absolute top-0 left-0 w-[150px] p-3`}
            >
              <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />
              {currencyType.map((cur: string, index: number) => (
                <button
                  onClick={() => handleAmountToSend(cur)}
                  type="button"
                  key={index}
                  className="text-white/70 relative z-10 hover:bg-white/10 w-full"
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            value={totalAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalAmount(e.target.value)}
            id="amount"
            placeholder="10000"
            className="text-[#FBFBFB99]/90 text-[16px] w-full font-[600px] outline-none bg-transparent border-none py-[16px]"
          />
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full z-10 text-[16px] font-[600] font-[Open Sans] text-[#FBFBFB] cursor-pointer bg-[#FBFBFB12] hover:bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] border-[1px] border-white/20"
        >
          Confirm payment
        </button>
      </div>
    </div>
  );
}