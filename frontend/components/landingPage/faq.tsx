    "use client";

    import { ArrowLeft, ArrowRight } from "lucide-react";
    import Image from "next/image";
    import { useState } from "react";
    export default function Faq() {
    const faqs = [
        {
        question: "Do I need crypto experience to use Swift?",
        answer:
            "Nope! Swift uses Starknet’s account abstraction, so you can sign up using just your email or social account — no seed phrase, no gas fees, no crypto knowledge needed.",
        },
        {
        question: "How do I accept payments as a merchant?",
        answer:
            "Just generate a QR code inside the app by entering the amount and choosing your currency (USDC, USDT, or STRK). Customers scan and pay directly from their wallets.",
        },
        {
        question: "Can I get paid in Naira (NGN)?",
        answer:
            "Yes. After receiving crypto, you can request a withdrawal in NGN. For the demo, it’s simulated with fixed conversion rates, but real off-ramping will be integrated in production.",
        },
        {
        question: "What is payment splitting?",
        answer:
            "Payment splitting allows SMEs to automatically divide received payments among multiple wallets. Great for teams, cooperatives, or vendors with revenue sharing.",
        },
        {
        question: "What fees does Swift charge?",
        answer:
            "A 0.5% transaction fee is taken from merchant payments. This helps cover operational costs and keeps the platform running smoothly.",
        },
        {
        question: "Is it possible to accept payments without internet?",
        answer:
            "Yes, customers can scan QR codes offline and their wallet will process the payment once it reconnects to the internet. Perfect for low-connectivity areas.",
        },
    ];
    const [index, setIndex] = useState(0);
    const itemsPerPage = 2;

    const next = () => {
        if (index + itemsPerPage < faqs.length) {
        setIndex(index + itemsPerPage);
        }
    };

    const prev = () => {
        if (index - itemsPerPage >= 0) {
        setIndex(index - itemsPerPage);
        }
    };

      const currentFaqs = faqs.slice(index, index + itemsPerPage);


    return (
        <div className="relative w-full bg-cover bg-no-repeat justify-center h-auto flex flex-col items-center ">
        <div className="flex flex-col z-10 gap-[16px] space-y-12  overflow-hidden relative">
            <div className="flex flex-col lg:flex-row w-full items-start justufy-between space-x-20">
            <h1 className="text-[30px] xl:text-[46px] font-[600] bg-[linear-gradient(90deg,#FBFBFB_0%,#8F6DF5_39.42%,#FBFBFB_93.75%)] bg-clip-text text-transparent font-[Montserrat] text-#FBFBFB">
                Have any Questions? We’ve Got Your Answers
            </h1>
            <p className="text-[18px] py-[10px] font-[400] text-white">
                Here are some of the most common things users ask about Swift —
                from wallet setup to withdrawals. Still need help? Reach out
                anytime.
            </p>
            </div>
            <div
            className="flex flex-col lg:flex-row items-center justify-center space-x-20 transition-transform duration-500"

            >
            {currentFaqs.map((faq, index) => (
                <div
                key={index}
                className="flex flex-col  w-full items-start justufy-between space-x-20"
                style={{ width: "100%" }}
                >
                <h1 className="text-[30px] font-[600] bg-[linear-gradient(90deg,#FBFBFB_0%,#8F6DF5_39.42%,#FBFBFB_93.75%)] bg-clip-text text-transparent font-[Montserrat] text-#FBFBFB">
                    {faq.question}
                </h1>
                <p className="text-[18px] py-[10px] font-[400] text-white">
                    {faq.answer}
                </p>
                </div>
            ))}
            </div>
            <div className="w-full justify-end space-x-20 flex items-center pb-5 pr-5">
            <button
            onClick={prev}
                type="button"
                  disabled={index === 0}
                className="p-[10px] cursor-pointer relative w-fit text-white disabled:opacity-40 text-[18px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
            >
                <ArrowLeft size={30} color="white" />
                <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
            </button>
            <button
            onClick={next}
                type="button"
                 disabled={index + itemsPerPage >= faqs.length}
                className="p-[10px] cursor-pointer relative w-fit text-white disabled:opacity-40 text-[18px] font-[700] flex items-center justify-center bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px]"
            >
                <ArrowRight size={30} color="white" />
                <span className="absolute top-[50px] left-[32.05px] w-[137px] h-[13px] bg-[#B8A0FF] rounded-[50px] opacity-100 blur-[60px]"></span>
            </button>
            </div>
        </div>
        </div>
    );
    }
