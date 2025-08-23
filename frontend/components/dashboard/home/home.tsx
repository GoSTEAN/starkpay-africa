import {
  ChevronRight,
  CircleCheck,
  Eye,
  EyeClosed,
  Loader2,
  RotateCcw,
  TriangleAlert,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import useGetBalance from "@/hooks/useGetBalance";
import useExchangeRates from "@/hooks/useExchangeRate";

interface DashboardProps {
  transactions: any[];
}

export default function DashboardHome({ transactions }: DashboardProps) {
  const [activeDuration, setActiveDration] = useState("Week");
  
  const {
    balances,
    loading: balanceLoading,
    error: balanceError,
    refetch,
  } = useGetBalance();
  const [hideDetails, setHideDetals] = useState(false);
  const exchangeRates = useExchangeRates();

  const handleHideDetails = () => {
    setHideDetals(!hideDetails);
  };
  const handleDurationChange = (dur: string) => {
    setActiveDration(dur);
  };
  
  // Calculate total balance in Naira
  const totalBalance = useMemo(() => {
    if (balanceLoading || !exchangeRates.rates) return "0";
    
    let total = 0;
    
    // Calculate USDT balance in Naira
    if (balances.USDT) {
      const usdtAmount = Number.parseFloat(balances.USDT);
      if (!isNaN(usdtAmount)) {
        const rate = exchangeRates.rates.USDT;
        if (rate) {
          total += usdtAmount * Number(rate);
        }
      }
    }
    
    // Calculate USDC balance in Naira
    if (balances.USDC) {
      const usdcAmount = Number.parseFloat(balances.USDC);
      if (!isNaN(usdcAmount)) {
        const rate = exchangeRates.rates.USDC;
        if (rate) {
          total += usdcAmount * Number(rate);
        }
      }
    }
    
    // Calculate STRK balance in Naira
    if (balances.STRK) {
      const strkAmount = Number.parseFloat(balances.STRK);
      if (!isNaN(strkAmount)) {
        const rate = exchangeRates.rates.STRK;
        if (rate) {
          total += strkAmount * Number(rate);
        }
      }
    }
    
    // Format the total with commas
    return total.toLocaleString('en-NG', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  }, [balances, exchangeRates, balanceLoading]);

  const currencyFiltered = transactions.filter((tx) =>
    ["STRK", "USDT", "USDC", "NGN"].includes(tx.currency)
  );

  const removeDuplicates = (transactions: any) => {
    const uniqueTransactions = new Map();

    transactions.forEach((tx:any) => {
      const existingTx = uniqueTransactions.get(tx.id);
      if (
        !existingTx ||
        new Date(tx.timestamp) > new Date(existingTx.timestamp)
      ) {
        uniqueTransactions.set(tx.id, tx);
      }
    });

    return Array.from(uniqueTransactions.values());
  };

  // Remove duplicates, keeping the most recent
  const uniqueTransactions = removeDuplicates(currencyFiltered);

  // Sort by timestamp (newest first)
  const sortedTransactions = [...uniqueTransactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const accNo = "0234567890";
  const img = "/user.jpg";
  const recentNames = [
    "Peter Onoja",
    "Susan Simon",
    "Ezikel David",
    "Peace Michael",
    "Jerry Joe",
  ];

  const thead = ["Name", "Amount", "Date", "Status"];
  const duration = ["All", "Week", "Months"];
  
  return (
    <section className="relative rounded-[19px] items-center py-[66px] w-full h-full  bg-[#212324] overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px]">
      <div className="w-full h-full flex flex-col gap-[32px]  overflow-y-scroll">
        <div className="flex flex-col gap-[8px] ">
          {/* <Image
              src={'/Swift logo.svg'}
              alt="swift logo"
              width={100}
              height={100}
          /> */}
          {/* <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Dashboard
          </h1> */}
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            View all your details here.
          </p>
        </div>

        <div className=" w-full max-[852px] h-auto p-[32px]  bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90  border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col">
          <div className="text-[16px] text-[#8F6DF5] flex gap-[8px]">
            <span>Total Balance</span>
            <button onClick={handleHideDetails} className=" cursor-pointer">
              {hideDetails ? (
                <EyeClosed color="white" />
              ) : (
                <Eye color="white" />
              )}
            </button>
          </div>
          <div className=" text-[20px] lg:text-[38px] text-white font-[600]">
            {hideDetails ? (
              <span className="text-wite text-2xl">******</span>
            ) : balanceLoading ? (
              <Loader2 color="white" className="animate-spin" size={30} />
            ) : (
              <span>₦ {totalBalance}</span>
            )}
          </div>

          <div className="flex flex-col gap-[15px] ">
            <h1 className="text-[16px] font-[600] text-[#8F6DF5] font-[Montserrat]">
              Account
            </h1>
            <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {hideDetails ? (
                <span className="text-wite text-2xl">****</span>
              ) : (
                <span> {accNo}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-[32px] items-center flex-col lg:flex-row w-full font-[Open Sans]">
          <div className=" rounded-[11px] p-[22px] gap-[12px] border border-[#8F6DF5]/30 flex flex-col w-full ">
            <h1 className="text-[16px] font-[600] text-[white]/70 font-[Montserrat]">
              USDC Balance
            </h1>
            <p className="text-[21px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {hideDetails ? (
                <span className="text-wite text-2xl">----</span>
              ) : (
                <span className="flex">
                  {balanceLoading ? (
                    <Loader2 color="white" className="animate-spin" />
                  ) : (
                    balances["USDC" as keyof typeof balances]
                  )}
                </span>
              )}
            </p>
          </div>
          <div className=" rounded-[11px] p-[22px] gap-[12px] border border-[#8F6DF5]/30 flex flex-col w-full ">
            <h1 className="text-[16px] font-[600] text-[white]/70 font-[Montserrat]">
              USDT Balance
            </h1>
            <p className="text-[21px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {hideDetails ? (
                <span className="text-wite text-2xl">----</span>
              ) : (
                <span className="flex">
                  {balanceLoading ? (
                    <Loader2 color="white" className="animate-spin" />
                  ) : (
                    balances["USDT" as keyof typeof balances]
                  )}
                </span>
              )}
            </p>
          </div>
          <div className=" rounded-[11px] p-[22px] border border-[#8F6DF5]/30 gap-[12px] flex flex-col w-full ">
            <h1 className="text-[16px] font-[600] text-[white]/70 font-[Montserrat]">
              STRK Balance
            </h1>
            <p className="text-[21px] font-[400] font-[Open Sans] text-[#FBFBFB]">
              {hideDetails ? (
                <span className="text-wite text-2xl">----</span>
              ) : (
                <span className="flex">
                  {balanceLoading ? (
                    <Loader2 color="white" className="animate-spin" />
                  ) : (
                    balances["STRK" as keyof typeof balances]
                  )}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] pt-9">
          <h1 className="text-[27px] font-[600] pb-9 text-[#8F6DF5] font-[Montserrat]">
            Quick Transfer
          </h1>
          <div className="flex justify-between gap-[24px] items-center">
            {recentNames?.map((name, id) => (
              <div key={id} className="flex flex-col overflow-x-scroll items-center justify-center">
                <div className="w-[50px] flex items-center justify-center h-[50px]  overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
                  {img ? (
                    <Image
                      src={img}
                      fill
                      alt="user profile image"
                      className="rotate-[-45deg]"
                    />
                  ) : (
                    <User
                      color="white"
                      size={100}
                      className="rotate-[-45deg]"
                    />
                  )}
                </div>
                <h1
                  className="text-[14px] w-[50px] text-center font-[400] text-[#8F6DF5] font-[Montserrat]"
                >
                  {name}
                </h1>
              </div>
            ))}
            <ChevronRight className="w-[20px]" color="white" size={30} />
          </div>
          <div className="w-full gap-[6px] mt-5 text-[white] font-[600] font-[Open Sans] flex items-center">
            <button className="bg-[#493E71] w-full py-[30px] rounded-[60px] hover:bg-[#493E71]/80">
              Marchant Payment
            </button>
            <button className="bg-[#493E71] w-full py-[30px] rounded-[60px] hover:bg-[#493E71]/80">
              Swap
            </button>
          </div>

          <div className="flex flex-col w-full mt-10 gap-[25px]">
            <div className="flex justify-between items-center">
              <h1 className="text-[24px] font-[600] pb-9 text-[#8F6DF5] font-[Montserrat]">
                Transactions
              </h1>
              <div className="flex gap-[10px] items-center">
                {duration?.map((dur, id) => (
                  <button
                    key={id}
                    onClick={() => handleDurationChange(dur)}
                    className={`cursor-pointer ${
                      activeDuration === dur
                        ? "text-[#8F6DF5] border-b borderb-[#8F6DF5]"
                        : "text-white hover:text-white/80"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className=" w-full max-[852px] overflow-scroll h-auto p-[32px] font-[Open Sans] bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90  border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col">
              <table className="w-full flex flex-col gap-[24px]">
                <thead className="text-[#8F6DF5] font-[400px] font-[Open Sans] flex flex-col gap-[24px] lg:text-[16px] text-[14px] border-b-[1px] border-[#FBFBFB1A]   w-full">
                  <tr className="flex items-center gap-[48px] pb-[16px] ">
                    {thead?.map((td, id) => (
                      <td
                        className={`w-full truncate ${
                          id > 0 ? "lg:w-[30%]" : "w-full"
                        }`}
                        key={id}
                      >
                        {td}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[#FBFBFB] font-[400px] gap-[24px] font-[Open Sans] text-[14px] lg:text-[16px] flex flex-col gap-[24px]  pb-[16px] w-full">
                  {sortedTransactions?.map((td, id) => (
                    <tr
                      key={id}
                      className="flex hover:bg-[#FBFBFB1A]/20 transition-all duration-300 items-center gap-[48px]  pb-[5] border-b border-[#FBFBFB1A] "
                    >
                      <td className="w-full flex truncate">
                        <div className="flex overflow-x-scroll gap-[8px] items-center justify-center">
                          <div className="w-[30px] flex-none flex items-center justify-center h-[30px]  overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
                            {img ? (
                              <Image
                                src={img}
                                fill
                                alt="user profile image"
                                className="rotate-[-45deg]"
                              />
                            ) : (
                              <User
                                color="white"
                                size={100}
                                className="rotate-[-45deg]"
                              />
                            )}
                          </div>
                          <h1 className="  text-center font-[400] text-[#FBFBFB] font-[Montserrat]">
                            talinanzing111
                          </h1>
                        </div>
                      </td>
                      <td className="w-full lg:w-[30%] truncate">
                        ${td.amount}
                      </td>
                      <td className="w-full lg:w-[30%] truncate"></td>
                      <td className="w-full lg:w-[30%] truncate flex gap-[2px] p-[6px_14px] items-center text-start justify-center bg-[#FBFBFB12] rounded-[30px]">
                        <span>
                          {td.type === "pending" ? (
                            <RotateCcw
                              size={15}
                              className=" hidden xl:flex text-xm "
                            />
                          ) : (
                            ""
                          )}
                        </span>{" "}
                        <span>
                          {td.type === "failed" ? (
                            <TriangleAlert
                              size={15}
                              className=" hidden xl:flex text-xm "
                            />
                          ) : (
                            ""
                          )}
                        </span>{" "}
                        <span>
                          {td.type === "success" ? (
                            <CircleCheck
                              size={15}
                              className=" hidden xl:flex text-xm "
                            />
                          ) : (
                            ""
                          )}
                        </span>
                        <span className="">{td.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

