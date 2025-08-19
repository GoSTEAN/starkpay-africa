"use client";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { AutoSwappr, TOKEN_ADDRESSES as SDK_TOKEN_ADDRESSES } from "autoswap-sdk";
import useGetBalance from "@/hooks/useGetBalance"; // Adjust path as needed


const AUTO_SWAPP_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUTOSWAP_CONTRACT_ADDRESS ;
console.log("AutoSwap Contract Address:", AUTO_SWAPP_CONTRACT_ADDRESS);
 
const TOKEN_DECIMALS = {
  [SDK_TOKEN_ADDRESSES.STRK]: 18,
  [SDK_TOKEN_ADDRESSES.USDC]: 6,
  [SDK_TOKEN_ADDRESSES.USDT]: 6,
};

export default function TokenSwap() {
  const { account, address } = useAccount();
  const [fromCurrency, setFromCurrency] = useState("STRK");
  const [toCurrency, setToCurrency] = useState("USDC");
  const [amountIn, setAmountIn] = useState("");
  const [fromToggle, setFromToggle] = useState(false);
  const [toToggle, setToToggle] = useState(false);
  const [estimatedOut, setEstimatedOut] = useState("--");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { balances, loading: balanceLoading, error: balanceError, refetch } = useGetBalance();

  const currencyType = ["STRK", "USDC", "USDT"];

  if(!AUTO_SWAPP_CONTRACT_ADDRESS){
  return
}
  
  // Initialize AutoSwappr SDK
  const autoswappr = new AutoSwappr({
    contractAddress: AUTO_SWAPP_CONTRACT_ADDRESS,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://starknet-sepolia.public.blastapi.io",
    accountAddress: address || "",
    privateKey: "",
  });

  const estimateOutput = async (
    tokenInAddr: string,
    tokenOutAddr: string,
    amount: string
  ) => {
    try {
      const currencyIn = Object.keys(SDK_TOKEN_ADDRESSES).find(
        (key) =>
          SDK_TOKEN_ADDRESSES[key as keyof typeof SDK_TOKEN_ADDRESSES] ===
          tokenInAddr
      ) as keyof typeof SDK_TOKEN_ADDRESSES;
      const decimalsIn = TOKEN_DECIMALS[SDK_TOKEN_ADDRESSES[currencyIn]];
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setEstimatedOut("--");
        return;
      }

      // Placeholder: Replace with actual SDK quote method if available
      const mockRate =
        fromCurrency === "STRK" && toCurrency === "USDC"
          ? 0.05
          : fromCurrency === "USDC" && toCurrency === "STRK"
          ? 20
          : 1;
      const estimated = (parsedAmount * mockRate).toFixed(2);
      setEstimatedOut(estimated);
    } catch (err) {
      console.error("Error estimating output:", err);
      setEstimatedOut("--");
      setError("Failed to estimate output");
    }
  };

  useEffect(() => {
    if (amountIn && address && fromCurrency !== toCurrency) {
      estimateOutput(
        SDK_TOKEN_ADDRESSES[fromCurrency as keyof typeof SDK_TOKEN_ADDRESSES],
        SDK_TOKEN_ADDRESSES[toCurrency as keyof typeof SDK_TOKEN_ADDRESSES],
        amountIn
      );
    } else {
      setEstimatedOut("--");
    }
  }, [amountIn, fromCurrency, toCurrency, address]);

  const handleSwitch = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setAmountIn(estimatedOut === "--" ? "" : estimatedOut);
    setEstimatedOut(amountIn || "--");
  };

  const handleSwap = async () => {
    if ( !address) {
      setError("Please connect your Starknet wallet");
      return;
    }

    if (!amountIn || Number(amountIn) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Cannot swap same currencies");
      return;
    }

    const parsedAmount = parseFloat(amountIn);
    const balanceNum = parseFloat(balances[fromCurrency as keyof typeof balances]);
    if (parsedAmount > balanceNum) {
      setError(`Insufficient ${fromCurrency} balance`);
      return;
    }

    const tokenInAddr = SDK_TOKEN_ADDRESSES[fromCurrency as keyof typeof SDK_TOKEN_ADDRESSES];
    const tokenOutAddr = SDK_TOKEN_ADDRESSES[toCurrency as keyof typeof SDK_TOKEN_ADDRESSES];
    const decimals = TOKEN_DECIMALS[tokenInAddr];
    const amountWei = BigInt(Math.floor(parsedAmount * 10 ** decimals)).toString();

    setLoading(true);
    setError("");

    try {
      const result = await autoswappr.executeSwap(tokenInAddr, tokenOutAddr, {
        amount: amountWei,
        isToken1: tokenInAddr > tokenOutAddr,
      });
      console.log("Swap result:", result);
      setLoading(false);
      alert(`Swap submitted! Tx: ${result.result.transaction_hash}`);
      refetch(); 
    } catch (err: any) {
      setError(`Swap failed: ${err.message || "Unknown error"}`);
      setLoading(false);
    }
  };

  return (
    <section className="relative z-[99] rounded-[19px] py-[66px] w-full h-full overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px] bg-[#212324]">
      <div className="flex flex-col gap-[8px] pb-[24px]">
        <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
          Token Swap
        </h1>
        <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
          Swap your token seamlessly with our easy-to-use swap feature.
        </p>
      </div>

      <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-start">
        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex flex-col gap-[18px] w-full">
            <h1 className="text-white">Account</h1>
          </div>
          <div className="flex flex-col gap-[18px] w-full">
            <div className="relative flex flex-col gap-[18px] w-full">
              <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px]">
                <div className="flex flex-col gap-[16px]">
                  <h1 className="opacity-50 text-[#FBFBFB]">From</h1>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setFromToggle(!fromToggle)}
                      className="text-white/90 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-pointer"
                    >
                      {fromCurrency}{" "}
                      <ChevronDown
                        color="white"
                        size={20}
                        className="border rounded-full"
                      />
                    </button>
                    <div
                      className={`${
                        fromToggle ? "flex" : "hidden"
                      } flex-col items-start justify-start absolute top-full left-0 w-[150px] p-3 bg-gray-800 z-10`}
                    >
                      {currencyType.map((cur, index) => (
                        <button
                          onClick={() => {
                            setFromCurrency(cur);
                            setFromToggle(false);
                          }}
                          type="button"
                          key={index}
                          className="text-white/70 hover:bg-white/10 w-full text-left p-1"
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-[16px]">
                  <div className="flex text-white/90 text-[18px] font-[500] items-center gap-[10px]">
                    <span>
                      Balance: {balanceLoading ? "Loading..." : balances[fromCurrency as keyof typeof balances]} {fromCurrency}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter amount"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    className="text-[#FBFBFB] text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-center -my-4 z-10">
                <button
                  onClick={handleSwitch}
                  className="w-fit bg-[#8F6DF533] p-3 rounded-full cursor-pointer hover:bg-[#8F6DF566] transition-colors"
                >
                  <ArrowUpDown color="white" size={24} />
                </button>
              </div>

              <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px]">
                <div className="flex flex-col gap-[16px]">
                  <h1 className="opacity-50 text-[#FBFBFB]">To</h1>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setToToggle(!toToggle)}
                      className="text-white/90 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-pointer"
                    >
                      {toCurrency}{" "}
                      <ChevronDown
                        color="white"
                        size={20}
                        className="border rounded-full"
                      />
                    </button>
                    <div
                      className={`${
                        toToggle ? "flex" : "hidden"
                      } flex-col items-start justify-start absolute top-full left-0 w-[150px] p-3 bg-gray-800 z-10`}
                    >
                      {currencyType.map((cur, index) => (
                        <button
                          onClick={() => {
                            setToCurrency(cur);
                            setToToggle(false);
                          }}
                          type="button"
                          key={index}
                          className="text-white/70 hover:bg-white/10 w-full text-left p-1"
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-[16px]">
                  <div className="flex text-white/90 text-[18px] font-[500] items-center gap-[10px]">
                    <span>
                      Balance: {balanceLoading ? "Loading..." : balances[toCurrency as keyof typeof balances]} {toCurrency}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="--"
                    value={estimatedOut}
                    disabled
                    className="text-[#FBFBFB] text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSwap}
              disabled={
                loading ||
                balanceLoading ||
                !address ||
                !amountIn ||
                Number(amountIn) <= 0 ||
                fromCurrency === toCurrency
              }
              className="w-full text-[16px] flex items-center border-2 border-[#FBFBFB12]/60 justify-center font-[600] font-[Open Sans] text-[#FBFBFB]/60 cursor-pointer bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Swapping..." : "Swap"}</span>{" "}
              <ArrowUpDown color="white" size={20} />
            </button>
            {(error || balanceError) && (
              <p className="text-red-500">{error || balanceError}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}