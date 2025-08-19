"use client"

import { ChevronDown, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface NGNWithdrawalProps {
  triggerStatus: (type: string, status: string) => void
  addNotification: (notification: any) => void
}

export default function NGNWithdrawal({ triggerStatus, addNotification }: NGNWithdrawalProps) {
  // State declarations
  const [currency, setCurrency] = useState("NGN")
  const [toggle, setToggle] = useState(false)
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  //declaration
  const userImg = "/user.jpg"
  const accountNumber = "8101842464"
  const bankName = "Opay"
  const holdersName = "Tali Nanzing Moses"
  const currencyType = ["USDT", "NGN", "USDC", "STRK"]
  const accountBalance = "10000"

  //functions
  const handleToggle = () => setToggle(!toggle)

  const handleCurrencySelect = (selectedCurrency: string) => {
    setCurrency(selectedCurrency)
    setToggle(false)
  }

  const handleWithdrawal = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Invalid Amount",
        message: "Please enter a valid withdrawal amount",
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
      })
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(accountBalance)) {
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Insufficient Balance",
        message: "Withdrawal amount exceeds available balance",
        timestamp: new Date(),
        read: false,
        category: "withdrawal",
      })
      return
    }

    setIsProcessing(true)
    triggerStatus("transaction", "pending")

    // Simulate withdrawal processing
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        triggerStatus("transaction", "success")
        addNotification({
          id: Date.now(),
          type: "success",
          title: "Withdrawal Successful",
          message: `Successfully withdrew ${amount} ${currency} to ${bankName}`,
          timestamp: new Date(),
          read: false,
          category: "withdrawal",
        })
        setAmount("")
      } else {
        triggerStatus("transaction", "failed")
        addNotification({
          id: Date.now(),
          type: "error",
          title: "Withdrawal Failed",
          message: "Withdrawal request failed. Please try again.",
          timestamp: new Date(),
          read: false,
          category: "withdrawal",
        })
      }
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <section className="relative rounded-[19px] py-[66px] w-full h-full  overflow-y-scroll gap-[22px] flex flex-col  font-[Montserrat] px-[32px] bg-background">
      <div className=" flex flex-col gap-[8px] pb-[24px]">
        <h1 className="text-[32px] font-[600px] text-[#8F6DF5] font-[Montserrat]">NGN Withdrawal Request</h1>
        <p className="text-[16px] font-[400] font-[Open Sans] text-foreground">
          Set up automatic payment distribution for SMEs (e.g..., owner, workers, reserves)
        </p>
      </div>

      <div className="w-full h-auto p-[32px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col  items-start ">
        {accountNumber && bankName ? (
          <div className="flex flex-col gap-[16px]">
            <h1 className="text-[16px] font-[600px] text-[#8F6DF5] font-[Montserrat]">Account Details</h1>
            <div className="py-[16px] gap-[12px] relative px-[20px] rounded-[16px] border-[1px] border-[#8F6DF533] flex items-start w-fit">
              <div className="w-[55px] h-[55px] flex items-center justify-center relative rounded-full overflow-hidden bg-transparent border-x-[3px] rotate-45  border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)] ">
                {userImg ? (
                  <Image className="rotate-[-45deg]" src={userImg || "/placeholder.svg"} fill alt="user image" />
                ) : (
                  <User className="rotate-[-45deg]" color="white" size={40} />
                )}
              </div>
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[10px] items-center w-full justify-between">
                  <h1 className="text-[22px] font-[Inter] font-[500] text-foreground">{accountNumber}</h1>
                  <span className="py-[4px] px-[10px] rounded-[72px] text-[#3EAE1E] font-medium border-[0.7px] border-[#FBFBFB1A]">
                    NGN
                  </span>
                </div>
                <div className="flex gap-[10px] items-center w-full justify-between">
                  <h1 className="text-[16px] font-[Inter] font-[500] text-foreground">{bankName}</h1>
                  <button className=" p-[5px] cursor-pointer hover:bg-white/10 rounded-[72px] text-[#3EAE1E] font-medium border-[0.7px] border-[#FBFBFB1A]">
                    <ChevronDown color="white" size={20} />
                  </button>
                </div>
                <div className="flex gap-[10px] items-center w-full justify-between">
                  <h1 className="text-[18px] font-[Inter] font-[500] text-foreground">{holdersName}</h1>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-[16px] font-[600px] text-[#8F6DF5] font-[Montserrat]">No account details found</h1>
            <p className="text-[14px] font-[400] font-[Open Sans] text-foreground/50">
              Please add your bank account details to proceed with NGN withdrawal.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex flex-col gap-[18px] w-full">
            <h1 className="text-foreground">Account</h1>
            <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px] ">
              <div className="flex flex-col gap-[16px]">
                <h1 className="opacity-50 text-foreground">From</h1>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-foreground/90 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-pointer "
                  >
                    {currency} <ChevronDown color="currentColor" size={20} className="border rounded-full" />
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
                        className="text-foreground/70 relative z-10 hover:bg-white/10 w-full "
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className=" flex flex-col items-end gap-[16px]">
                <div className="flex text-foreground/90 text-[18px] font-[500] items-center gap-[10px]">
                  <span>Available Balance: </span> <span>{accountBalance}</span>
                </div>
                <input
                  type="text"
                  placeholder="--"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-[2px] rounded-[12px] w-full border-[#8F6DF533] bg-[#312E4266] gap-[12px] flex justify-between p-[26px] ">
              <div className="flex flex-col gap-[16px]">
                <h1 className="opacity-50 text-foreground">To</h1>
                <div className="relative">
                  <button
                    type="button"
                    className="text-foreground/90 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-pointer "
                  >
                    NGN
                  </button>
                </div>
              </div>
              <div className=" flex flex-col items-end gap-[16px]">
                <div className="flex text-foreground/90 text-[18px] font-[500] items-center gap-[10px]">
                  <span>Naira Equivalent </span>
                </div>
                <input
                  type="text"
                  placeholder="--"
                  disabled
                  value={amount ? (Number.parseFloat(amount) * 1650).toLocaleString() : "--"}
                  className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                />
              </div>
            </div>
            <div className=" rounded-[12px] w-full gap-[12px] flex justify-between p-[26px] ">
              <div className="flex flex-col gap-[16px]">
                <h1 className="opacity-50 text-foreground">Fees</h1>
                <div className="relative">
                  <button
                    type="button"
                    className="text-foreground opacity-50 items-center w-[100px] flex justify-between text-[21px] font-[600] font-[Montserrat] cursor-pointer "
                  >
                    Receive
                  </button>
                </div>
              </div>
              <div className=" flex flex-col items-end gap-[16px]">
                <input
                  type="text"
                  placeholder="0.0"
                  disabled
                  value={amount ? (Number.parseFloat(amount) * 0.005).toFixed(3) : "0.0"}
                  className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                />
                <div className="flex text-foreground/90 text-[18px] font-[500] items-center gap-[10px]">
                  <input
                    type="text"
                    placeholder="--"
                    disabled
                    value={
                      amount
                        ? ((Number.parseFloat(amount) - Number.parseFloat(amount) * 0.005) * 1650).toLocaleString()
                        : "--"
                    }
                    className="text-foreground text-[24px] font-[500] text-end outline-none border-none bg-transparent"
                  />{" "}
                  <span>NGN </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleWithdrawal}
              disabled={isProcessing || !amount}
              className="w-full text-[16px] font-[600] font-[Open Sans] text-foreground/60 cursor-pointer bg-[#FBFBFB12]/20 rounded-[48px] gap-[8px] py-[21px] px-[22px] hover:bg-transparent disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Request Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
