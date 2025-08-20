import React, { Suspense } from "react";
import PayerPayment from "@/components/dashboard/marchant payment/PayerPayment";

export default function PayPage() {
  return (
    <Suspense fallback={<div>Loading payment page...</div>}>
      <PayerPayment />
    </Suspense>
  );
}
