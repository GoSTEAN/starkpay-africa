"use client"

import type React from "react"
import { format } from "date-fns"
import { QrCode, Eye } from "lucide-react"

interface HistoryProps {
  title: string
  status: string
  description: string
  trackingId: string | number
  ngnValue: string
  timestamp?: Date
  transaction?: any
  onViewTransaction?: (transaction: any) => void
}

export default function HistoryCard({
  title,
  status,
  description,
  trackingId,
  ngnValue,
  timestamp,
  transaction,
  onViewTransaction,
}: HistoryProps) {
  const statusColors = {
    pending: { text: "text-yellow-500", bg: "bg-yellow-500/20" },
    success: { text: "text-green-500", bg: "bg-green-500/20" },
    failed: { text: "text-red-500", bg: "bg-red-500/20" },
  }

  const safeStatus = status || "pending"

  const isQRViewable = () => {
    if (!transaction || transaction.type !== "qr_payment" || !transaction.qrCodeData) {
      return false
    }

    if (transaction.status === "success") {
      return true // Always viewable if successful
    }

    if (transaction.expiresAt) {
      const now = new Date()
      const expiresAt = new Date(transaction.expiresAt)
      return now < expiresAt // Viewable if not expired
    }

    return false
  }

  const handleViewQR = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onViewTransaction && transaction) {
      onViewTransaction(transaction)
    }
  }

  return (
    <div
      className={`bg-transparent flex justify-between hover:bg-white/4 transition-all duration-300 items-center rounded-[48px] p-[24px] shadow-sm border border-[#FBFBFB33]/20 ${
        isQRViewable() ? "cursor-pointer hover:border-[#8F6DF5]/50" : ""
      }`}
      onClick={isQRViewable() ? handleViewQR : undefined}
    >
      <div className="flex flex-col gap-[8px] justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-[#8f6df5]">{title}</h3>
          {isQRViewable() && <QrCode className="w-5 h-5 text-[#8F6DF5]" />}
        </div>
        <p className="text-white">
          Amount: <span className="text-[#8F6DF5]">{description}</span>
        </p>
        <p className="text-white">
          NGN Value: <span className="text-[#8F6DF5]">{ngnValue}</span>
        </p>
        {timestamp && (
          <p className="text-xs text-[white]/70">{format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")}</p>
        )}
        {transaction?.type === "qr_payment" && transaction?.status === "pending" && transaction?.expiresAt && (
          <p className="text-xs text-yellow-500">
            Expires: {format(new Date(transaction.expiresAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[16px] px-[16px] py-[10px] rounded-full text-sm font-medium ${
            statusColors[safeStatus as keyof typeof statusColors]?.bg || "bg-gray-500/20"
          } ${statusColors[safeStatus as keyof typeof statusColors]?.text || "text-gray-500"}`}
        >
          {safeStatus === "success" ? "Completed" : safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
        </span>
        {isQRViewable() && (
          <button
            onClick={handleViewQR}
            className="p-2 rounded-full bg-[#8F6DF5]/20 hover:bg-[#8F6DF5]/30 transition-colors"
            title="View QR Code"
          >
            <Eye className="w-4 h-4 text-[#8F6DF5]" />
          </button>
        )}
      </div>
    </div>
  )
}
