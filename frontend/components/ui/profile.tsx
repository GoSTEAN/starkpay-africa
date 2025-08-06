import React from 'react'
import Image from 'next/image';
import { ShieldCheck, ChevronDown } from 'lucide-react';

export default function Profile() {
  return (
     <div className="w-full flex  h-[62.75px] opacity-100 relative pt-[19px] pr-[12px] pb-[19px] pl-[12px] gap-[8px] rounded-[60px] bg-transparent shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[#8F6DF5] text-16px font-[400] flex flex-none">
                Not verified
              </span>
              <ShieldCheck color="#8F6DF5" size={25} />
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="w-[50px] h-[50px] rounded-[70px] border-[1px] overflow-hidden border-[#8F6DF58C]/55 relative">
                <Image src={"/user.jpg"} alt="user profile image" fill />
              </div>
              <button type='button' className='cursor-pointer'>
                <ChevronDown color="white" size={20} />
              </button>
            </div>
          </div>
  )
}
