import Image from "next/image";

export default function HeroSection() {
  return (
    <div className=" w-full h-auto bg-transparent flex z-10 items-center justify-center">
      <div className=" w-full flex flex-col justify-center gap-y-12 gap-x-0 py-6 sm:py-16 md:py-24 lg:py-32 lg:flex-row lg:justify-between lg:gap-x-16 lg:gap-y-0 items-center">
        <div className="flex flex-col gap-[16px] w-full mt-15 lg:mt-0 ">
          <h1 className="text-3xl md:text-5xl font-[600] w-[70%] md:w-full font-[Montserrat] bg-[linear-gradient(336.98deg,rgba(1,123,252,0.84)_0.82%,#8CC2FB_52.4%,#FBFBFB_90.6%)] bg-clip-text text-transparent">
            Simplifying Crypto Payments for Nigerian Business
          </h1>
          <p className="text-[20px] font-[400] font-[Open Sans] text-white pb-12">
            StarkPay offers a seamless crypto payment solution tailored for
            Nigerian businesses. Accept crypto payments effortlessly and
            withdraw in naira with ease
          </p>
          <button type="button" className="py-[10px] cursor-pointer relative px-[31px] w-fit text-white text-[18px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]">
            connect wallet
            <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
          </button>
        </div>
        <div className="w-auto">
            <Image
                src="/design.svg"
                alt="Hero Section Image"
                width={450}
                height={450}
                className="w-full h-auto"
            />
        </div>
      </div>
    </div>
  );
}
