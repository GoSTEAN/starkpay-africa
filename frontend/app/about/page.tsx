// "use client"

// import React, { useState } from "react";

// export default function Register({ onRegister }: { onRegister: (isMerchant: boolean) => void }) {
//   return (
//     <div className="w-screen h-screen bg-[#212324] flex justify-center items-center">
//       <div className="max-w-[450px] max-h-[450px] h-full bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] border border-[#FBFBFB1F] rounded-lg justify-between flex w-full flex-col gap-[20px] py-[18px] px-[16px]">
//         <div>
//           <h1 className="text-[32px] font-bold text-[#8F6DF5]">Register as </h1>
//           <p className="text-[14px] font-[400] text-white/70">
//             Select your role to register
//           </p>
//         </div>
//         <div className="flex flex-col gap-[12px]">
//           <button onClick={() => onRegister(true)} className="bg-[#493E71] w-full border border-[#FBFBFB1F] hover:bg-transparent text-white/70 text-2xl font-bold rounded-full py-[16px] px-[24px]">
//             Merchant
//           </button>

//           <button onClick={() => onRegister(false)} className="bg-[#493E71] w-full border border-[#FBFBFB1F] hover:bg-transparent text-white/70 text-2xl font-bold rounded-full py-[16px] px-[24px]">
//             User
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }