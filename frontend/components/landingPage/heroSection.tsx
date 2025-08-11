import Image from "next/image";
import { WalletConnectorModal } from "../providers/wallet-connector";

export default function HeroSection() {
  return (
    <div className=" w-full h-auto bg-transparent flex z-10 items-center justify-center">
      <div className=" w-full flex flex-col justify-center gap-y-12 gap-x-0 py-6 sm:pt-16 md:pt-24 lg:pt-32 lg:flex-row lg:justify-between lg:gap-x-16 lg:gap-y-0 items-center">
        <div className="flex flex-col gap-[16px] w-full mt-15 lg:mt-0 ">
          <h1 className="text-3xl md:text-5xl lg:text-[75px] font-[600] w-[70%] md:w-full font-[Montserrat] bg-[linear-gradient(336.98deg,rgba(1,123,252,0.84)_0.82%,#8CC2FB_52.4%,#FBFBFB_90.6%)] bg-clip-text text-transparent">
            Simplifying Crypto Payments for Nigerian Business
          </h1>
          <p className="text-[20px] lg:text-[30px] font-[400] font-[Open Sans] text-white pb-12">
            StarkPay offers a seamless crypto payment solution tailored for
            Nigerian businesses. Accept crypto payments effortlessly and
            withdraw in naira with ease
          </p>
          <WalletConnectorModal />
        </div>
        <div className="w-full border border-white h-full">
          <div className="w-full border border-white h-[650px] relative">
            <Image
              src="/design.svg"
              alt="Hero Section Image"
              fill
              className="w-full h-auto border-5 border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
