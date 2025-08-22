import React from 'react'
import ConnectWallet from '../providers/wallet-connector'

export default function Logout() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
            <div className='w-[300px] justify-around flex flex-col items-center h-[400px] bg-[#FBFBFB12] shadow-[inset_2px_4px_40px_0px_#FFFFFF1A,inset_0px_-2px_9px_0px_#FFFFFF59] rounded-[50px] border border-[white]/20'>
                <p className='text-center text-[30px] text-[#8F6DF5]'>Are you sure you want to Disconnect?</p>
                <ConnectWallet />
            </div>
    </div>
  )
}

