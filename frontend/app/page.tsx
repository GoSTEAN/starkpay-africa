import Faq from "@/components/landingPage/faq";
import Features from "@/components/landingPage/features";
import HeroSection from "@/components/landingPage/heroSection";
import Values from "@/components/landingPage/values";
import WhyStarkpay from "@/components/landingPage/whyStarkpay";
import React from "react";

export default function Home() {
  return (
    <div className="relative overflow-y-scroll w-full pl-10 sm:px-[50px] min-h-screen flex flex-col items-end justify-center gap-0 bg-[#111111] lg:px-[200px]">
      <svg
          width="1535"
          height="521"
          viewBox="0 0 1535 521"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 w-full h-auto bg-transparent"
        >
          <defs>
            <linearGradient
              id="gradient"
              x1="0"
              y1="521"
              x2="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="20%" stopColor="rgba(31, 153, 225, 2)" />
              <stop offset="69.46%" stopColor="rgba(143, 109, 245, 2)" />
              <stop offset="100%" stopColor="rgba(48, 0, 155, 2)" />
            </linearGradient>

            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>

          <path
            d="M0 0H1535V400C1100 300 900 0 200 400H0V0Z"
            fill="url(#gradient)"
            filter="url(#blur)"
            opacity="100"
          />
        </svg>
      <div className=" w-[1139.29px] h-[117.19px] top-120 fixed animate-customSpin  left-[382px] opacity-100 bg-[#8F6DF580] blur-[100px] rotate-[137.29deg]"
      
      ></div>
      <div className="flex flex-col gap-50">

      <HeroSection />
      {/* <Features /> */}
      <Values />
      <WhyStarkpay />
      <Faq />
      </div>
    </div>
  );
}
