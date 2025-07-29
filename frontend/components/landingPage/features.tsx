import React from "react";
import Image from "next/image";

export default function Features() {
  return (
    <div className="relative w-full bg-cover bg-no-repeat bg-center h-auto flex items-center justify-center">
       <Image
        src="/main linked cards.svg"
        alt="features"
        width={1600}
        height={100}
        className=" h-auto object-cover"
      />
    </div>
  );
}
