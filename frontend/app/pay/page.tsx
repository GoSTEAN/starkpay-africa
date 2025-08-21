

"use client";

import { Suspense } from "react";
import PayerPayment from '@/components/dashboard/marchant-payment/PayerPayment';


export default function PayPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <div className="w-screen h-screen flex justify-center items-center bg-[#212324]">
      <PayerPayment />
      </div>
  </Suspense>
  );
}
