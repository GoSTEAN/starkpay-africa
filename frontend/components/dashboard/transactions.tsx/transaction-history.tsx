"use client";
import { Menu } from "lucide-react";
import HistoryCard from "./history-card";
import { useState } from "react";

interface TransactionHistoryProps {
  transactions: any[];
  onViewTransaction?: (transaction: any) => void;
}

export default function TransactionHistory({
  transactions,
  onViewTransaction,
}: TransactionHistoryProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [dropToggle, setDropToggle] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setDropToggle(!dropToggle);
  };

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "success", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true;
    if (activeTab === "success") return tx.status === "success";
    return tx.status === activeTab;
  });

  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

console.log(filteredTransactions)
 

  return (
    <div className="relative rounded-[19px] w-full h-full py-[26px] gap-[22px] flex flex-col lg:flex-row items-center justify-between font-[Montserrat] px-5 xl:px-[32px] bg-transparent ">
      <div className="lg:w-[200px] fixed z-10 lg:min-h-[488px]  justify-between items-center lg:items-start hidden lg:flex lg:justify-start overflow-x-scroll lg:overflow-hidden lg:flex-col gap-[42px]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab.value)}
            className={`flex flex-none items-center gap-[12px] transform ease-in-out duration-300 hover:w-fit overflow-hidden px-[12px] h-[50px] rounded-full shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]
              ${
                activeTab === tab.value
                  ? "border-t-[3px] border-[#8F6DF5] w-fit"
                  : ""
              }`}
          >
            <span className="text-white font-[500] text-[14px] flex flex-none">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div  className={`lg:hidden  ${
            dropToggle ? "hidden" : "flex"
          } cursor-pointer pr-10 z-20 w-full justify-end `}>
        <button
          className=" shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)] w-fit p-2"
          onClick={() => handleTabChange(activeTab)}
        >
          <Menu color="white" size={20} />
        </button>
      </div>
      {/* Mobile dropdown */}
      <div
        className={`absolute top-0 z-10 w-full justify-between items-start p-10 ${
          dropToggle ? "flex" : "hidden"
        } overflow-hidden flex-col rounded-[19px] border border-white/20 overflow-x-scroll  gap-[42px]`}
      >
        <div className="absolute inset-0 bg-transparent rounded-[19px] backdrop-blur-lg pointer-events-none" />

        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTab(tab.value);
              setDropToggle(!dropToggle);
            }}
            className={`flex z-10 flex-none items-center gap-[12px] transform ease-in-out duration-300 hover:w-fit overflow-hidden px-[12px] h-[50px] rounded-full shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]
              ${
                activeTab === tab.value
                  ? "border-t-[3px] border-[#8F6DF5] w-fit"
                  : ""
              }`}
          >
            <span className="text-white font-[500] text-[14px] flex flex-none">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full h-full">
        <div className="w-full lg:w-3/4 mx-auto">
        <div className="sticky top-0">
                <div className="absolute inset-0 bg-transparent backdrop-blur-lg pointer-events-none" />

          <div className="mb-8 sticky top-0">
            <h1 className="text-4xl font-bold text-[#8f6df5] mb-2">
              Transaction History
            </h1>
            <p className="text-gray-500 text-lg">
              {activeTab === "pending"
                ? "Pending transactions"
                : activeTab === "failed"
                ? "Failed transactions"
                : activeTab === "success"
                ? "Completed transactions"
                : "All transactions"}
            </p>
          </div>
        </div>

          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12 text-[#8F6DF5]">
              <p className="text-lg">
                No {activeTab === "all" ? "" : activeTab} transactions found
              </p>
            </div>
          ) : (
            <div className="space-y-6 flex  flex-col w-full overflow-y-scroll">
              {sortedTransactions.map((tx) => (
                <HistoryCard
                  key={tx.id}
                  status={tx.status}
                  title={
                    tx.type === "qr_payment"
                      ? "QR Payment"
                      : tx.type === "withdrawal"
                      ? "Withdrawal"
                      : "Transaction"
                  }
                  description={`${tx.amount} ${tx.currency}`}
                  trackingId={tx.id}
                  ngnValue={`₦${tx.amount?.toLocaleString() || "0"}`}
                  timestamp={tx.timestamp}
                  transaction={tx}
                  onViewTransaction={onViewTransaction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
