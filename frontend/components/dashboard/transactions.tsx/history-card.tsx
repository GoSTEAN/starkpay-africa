import React from "react";
import Link from "next/link";
import { format } from "date-fns";

interface HistoryProps {
  title: string;
  status: string;
  description: string;
  trackingId: string | number;
  ngnValue: string;
  timestamp?: Date;
}

export default function HistoryCard({
  title,
  status,
  description,
  trackingId,
  ngnValue,
  timestamp,
}: HistoryProps) {
  const statusColors = {
    pending: { text: "text-yellow-500", bg: "bg-yellow-500/20" },
    completed: { text: "text-green-500", bg: "bg-green-500/20" },
    failed: { text: "text-red-500", bg: "bg-red-500/20" },
  };

  return (
    <div className="bg-transparent flex justify-between hover:bg-white/4 transition-all duration-300 items-center rounded-[48px] p-[24px] shadow-sm border border-[#FBFBFB33]/20">
      <div className="flex flex-col gap-[8px] justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-[#8f6df5]">{title}</h3>
        <p className="text-white">
          Amount: <span className="text-[#8F6DF5]">{description}</span>
        </p>
        <p className="text-white">
          NGN Value: <span className="text-[#8F6DF5]">{ngnValue}</span>
        </p>
        {timestamp && (
          <p className="text-xs text-[#8F6DF5]/70">
            {format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")}
          </p>
        )}
      </div>
      <div className="space-y-1 text-gray-600">
        <span
          className={`text-[16px] px-[16px] py-[10px] rounded-full text-sm font-medium ${
            statusColors[status as keyof typeof statusColors]?.bg || "bg-gray-500/20"
          } ${
            statusColors[status as keyof typeof statusColors]?.text || "text-gray-500"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}