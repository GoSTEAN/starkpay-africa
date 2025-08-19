import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Qrcodeprops {
  qrcode: string;
  settoggle: React.Dispatch<React.SetStateAction<boolean>>;
  Amount: number | string;
  currency: string;
  ngnValue: string;
  label: string;
  transactionHash: string;
  paymentId: string;
}
export default function QrCodComponent({
  qrcode,
  settoggle,
  Amount,
  currency,
  label,
  ngnValue,
  transactionHash,
  paymentId,
}: Qrcodeprops) {
  return (
    <div
      className={`" rounded-[19px] relative z-10  py-[46px] gap-[22px] flex flex-col justify-between font-[Montserrat] px-[32px]  bg-[#212324] w-full h-full "`}
    >
      <div className="flex flex-col gap-[22px]">
        <p className="text-[#FBFBFB] text-[20px] font-[400]">
          Accepting USDC, USDT,or STRK payments from customers using QR codes
        </p>
      </div>

      <div className="flex flex-col  gap-8 w-full h-full">
        <div className="w-full h-full justify-center flex flex-col items-center gap-[20px]">
          <div className="sm:w-full max-w-[400px] sm:h-full w-[300px] h-[300px]  overflow-hidden max-h-[400px] relative  p-5 rounded-[20px]">
            <Image src={qrcode} alt="Paymant Qr Code" fill />
          </div>
          {/* <p className="text-white font-[500] text-[18px]">Scan Here</p> */}
        </div>
        <div className="flex  gap-2 w-full items-center justify-center">
          <h1 className="bg-[#8F6DF5B2]/70 text-[#FBFBFB] rounded-[42px] px-[24px] py-[10px] text-[18px] font-[500]">
            Amount: {Amount}
          </h1>
          <h1 className="bg-[#8F6DF5B2]/70 text-[#FBFBFB] rounded-[42px] px-[24px] py-[10px]  text-[18px] font-[500]">
            Token: {currency}
          </h1>
          <h1 className="bg-[#8F6DF5B2]/70 text-[#FBFBFB] rounded-[42px] px-[24px] py-[10px]  text-[18px] font-[500]">
            Payment ID: {paymentId}
          </h1>
          <h1 className="bg-[#8F6DF5B2]/70 text-[#FBFBFB] rounded-[42px] px-[24px] py-[10px]  text-[18px] font-[500]">
            NGN Value: {ngnValue}
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={() => settoggle(false)}
        className="absolute right-4 top-3 z-[99]"
      >
        <X color="white" size={25} />
      </button>
    </div>
  );
}
