// import PayerPayment from '@/components/dashboard/marchant-payment/PayerPayment';
// import React from 'react';

// export default function page() {
//     return <PayerPayment />;
// }

"use client";

import { Suspense } from "react";
import PayerPayment from '@/components/dashboard/marchant-payment/PayerPayment';


export default function PayPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PayerPayment />
    </Suspense>
  );
}
