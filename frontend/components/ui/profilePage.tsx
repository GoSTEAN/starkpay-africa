import {
  ChevronDown,
  Copy,
  Loader,
  LogOut,
  PencilLine,
  Shield,
  User,
  Verified,
  Wallet,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { useUserRole } from "@/hooks/getUserRole";
import { Contract, RpcProvider } from "starknet";
import BecomeAMerchant from "../dashboard/home/become-a-marchant";
import { STARKPAY_ABI as MERCHANT_ABI } from "@/hooks/useStarkpayContract";

// Type definitions
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  accountNo: string;
}

interface EditState {
  name: boolean;
  email: boolean;
  phone: boolean;
  location: boolean;
}

interface EditValues {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface EditableFieldProps {
  field: keyof EditState;
  label: string;
  value: string;
  multiline?: boolean;
}

export default function ProfilePage() {
  const { account, address } = useAccount();
  const { role, loading, error, isMerchant } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  
  // User info states
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Nanzing Moses Tali",
    email: "talinanzing111@gmail.com",
    phone: "1234567890",
    location: "No 4 Mozambique Barnawa Complex, Kaduna",
    accountNo: "0234567890"
  });
  
  // Edit states
  const [isEditing, setIsEditing] = useState<EditState>({
    name: false,
    email: false,
    phone: false,
    location: false
  });
  
  // Temp edit values
  const [editValues, setEditValues] = useState<EditValues>({
    name: "",
    email: "",
    phone: "",
    location: ""
  });
  
  const MERCHANT_ADDRESS: string | undefined = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  console.log("Account XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", account);
  console.log("Account XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", address);

  if (!MERCHANT_ADDRESS) {
    console.log("failed to fetch merchant address");
    return;
  }
  
  const url: string | undefined = process.env.NEXT_PUBLIC_RPC_URL;
  if (!url) return;
  
  const provider = new RpcProvider({
    nodeUrl: url,
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserInfo: string | null = localStorage.getItem('userProfile');
    if (savedUserInfo) {
      try {
        const parsedUserInfo: UserInfo = JSON.parse(savedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing saved user info:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever userInfo changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userInfo));
  }, [userInfo]);

  const startEdit = (field: keyof EditState): void => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setEditValues(prev => ({ ...prev, [field]: userInfo[field] }));
  };

  const cancelEdit = (field: keyof EditState): void => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setEditValues(prev => ({ ...prev, [field]: "" }));
  };

  const saveEdit = (field: keyof EditState): void => {
    if (editValues[field].trim()) {
      setUserInfo(prev => ({ ...prev, [field]: editValues[field].trim() }));
    }
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setEditValues(prev => ({ ...prev, [field]: "" }));
  };

  const handleInputChange = (field: keyof EditValues, value: string): void => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    alert("Copied to clipboard!");
  };

  if (loading)
    return (
      <span className="px-3 z-10 py-1 w-full h-full flex justify-center items-center text-lg animate-pulse">
        <Loader color="white" className="animate-spin" size={50} />
      </span>
    );

  if (error)
    return (
      <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full">
        Error
      </span>
    );

  if (role === null) return null;

  const img = "/user.jpg";

  const handleBecomeMerchant = async (): Promise<void> => {
    if (!address) {
      setRegisterError("Please connect your Starknet wallet");
      setRegisterLoading(false);
      return;
    }

    setRegisterLoading(true);
    setRegisterError("");

    try {
      const contract = new Contract(MERCHANT_ABI, MERCHANT_ADDRESS, provider);
      if (account) {
        // contract.connect(account);
      } else {
        setRegisterError("No account found. Please connect your wallet.");
        setRegisterLoading(false);
        return;
      }
      const result = await contract.invoke("become_merchant", [], {
        maxFee: "0x0",
      });
      console.log("Become merchant result:", result);
      await provider.waitForTransaction(result.transaction_hash);
      alert("Successfully registered as a merchant! Refreshing page...");
      window.location.reload();
    } catch (err: any) {
      setRegisterError(
        `Registration failed: ${err.message || "Unknown error"}`
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegister = (confirm: boolean): void => {
    setShowModal(false);
    if (confirm) {
      handleBecomeMerchant();
    }
  };

  const EditableField: React.FC<EditableFieldProps> = ({ field, label, value, multiline = false }) => (
    <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
      <div className="flex justify-between items-center">
        <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
          {label}
        </h1>
        {!isEditing[field] && (
          <button
            onClick={() => startEdit(field)}
            className="text-[#8F6DF5] hover:text-[#8F6DF5]/70 transition-colors"
          >
            <PencilLine size={14} />
          </button>
        )}
      </div>
      
      {isEditing[field] ? (
        <div className="flex gap-2 items-center">
          {multiline ? (
            <textarea
              value={editValues[field]}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field, e.target.value)}
              className="flex-1 bg-[#312E44] text-white p-2 rounded-md border border-[#FBFBFB1F] focus:border-[#8F6DF5] focus:outline-none resize-none"
              rows={2}
              autoFocus
            />
          ) : (
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={editValues[field]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field, e.target.value)}
              className="flex-1 bg-[#312E44] text-white p-2 rounded-md border border-[#FBFBFB1F] focus:border-[#8F6DF5] focus:outline-none"
              autoFocus
            />
          )}
          <button
            onClick={() => saveEdit(field)}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => cancelEdit(field)}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
          {value}
        </p>
      )}
    </div>
  );

  return (
    <section className="relative rounded-[19px] items-center py-[66px] w-full h-full bg-[#212324] overflow-y-scroll gap-[22px] flex flex-col font-[Montserrat] px-[32px]">
      <div className="w-full h-full flex flex-col gap-[32px] max-w-[852px]">
        <div className="flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Profile
          </h1>
          <p className="text-[16px] font-[400] font-[Open Sans] text-[#FBFBFB]">
            View and edit all your details here.
          </p>
        </div>

        <div className="w-full max-[852px] h-auto p-[32px] bg-gradient-to-l from-[#8F6DF5]/20 to-[#212324]/90 border border-[#FBFBFB1F] gap-6 rounded-[19px] opacity-100 flex flex-col items-center">
          <div className="lg:w-[183.75px] w-[120px] flex items-center justify-center lg:h-[183.75px] h-[120px] overflow-hidden relative rounded-full bg-transparent border-x-[3px] rotate-45 border-x-white shadow-[inset_0_0_11px_10px_rgba(50,50,50,0.4),inset_0_-1px_4px_rgba(255,255,255,0.1)]">
            {img ? (
              <Image
                src={img}
                fill
                alt="user profile image"
                className="rotate-[-45deg]"
              />
            ) : (
              <User color="white" size={100} className="rotate-[-45deg]" />
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            {isEditing.name ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-[#312E44] text-[#8F6DF5] text-[26px] font-[600] font-[Montserrat] p-2 rounded-md border border-[#FBFBFB1F] focus:border-[#8F6DF5] focus:outline-none text-center"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit('name')}
                  className="text-green-500 hover:text-green-400 transition-colors"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => cancelEdit('name')}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-[26px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                  {userInfo.name}
                </h1>
                <button
                  onClick={() => startEdit('name')}
                  className="text-[#8F6DF5] hover:text-[#8F6DF5]/70 transition-colors"
                >
                  <PencilLine size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-[22px] items-center">
            <div className="text-[#4A6CE8] bg-[#292D40] text-[18px] rounded-[10px] p-[10px_14px] flex items-center gap-1 cursor-pointer hover:text-[#4A6CE8]/70 font-[400] font-[Open Sans]">
              <Shield />
              <span>Verified</span>
            </div>
          </div>

          <div className="flex gap-[10px] items-center text-white text-[18.7px]">
            <Wallet />
            <span>{userInfo.accountNo}</span>
            <button
              onClick={() => copyToClipboard(userInfo.accountNo)}
              className="hover:text-[#8F6DF5] transition-colors"
            >
              <Copy />
            </button>
            <LogOut />
          </div>
        </div>

        <div className="flex flex-col gap-[8px] pb-[24px]">
          <h1 className="text-[32px] font-[600] text-[#8F6DF5] font-[Montserrat]">
            Info
          </h1>
        </div>
        
        <div className="gap-[24px] bg-[linear-gradient(253.67deg,rgba(143,109,245,0.1)_18.27%,rgba(33,35,36,0.1)_91.93%)] flex flex-col w-full lg:flex-row border border-[#FBFBFB1F] p-[23px] rounded-[19px] opacity-100">
          <div className="flex flex-col w-full gap-[24px]">
            <EditableField 
              field="name" 
              label="Full Name" 
              value={userInfo.name} 
            />
            
            <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Account Number
              </h1>
              <p className="text-[16px] truncate font-[400] font-[Open Sans] text-[#FBFBFB]">
                {userInfo.accountNo}
              </p>
            </div>
            
            <div className="border-b-[1px] flex flex-col gap-[8px] pb-[24px] border-[#FBFBFB1A]">
              <h1 className="text-[14px] font-[600] text-[#8F6DF5] font-[Montserrat]">
                Account Type
              </h1>
              <p className="text-[16px] font-[400] font-[Open Sans] flex justify-between items-center text-[#FBFBFB]/50">
                <span>{isMerchant ? "Merchant" : "User"}</span>
                {!isMerchant && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer bg-[#5f3ec5] text-white/80 p-[8px] rounded-md hover:bg-[#5f3ec5]/80"
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Registering..." : "Become a Merchant"}
                  </button>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col w-full gap-[24px]">
            <EditableField 
              field="email" 
              label="Email Address" 
              value={userInfo.email} 
            />
            
            <EditableField 
              field="phone" 
              label="Phone Number" 
              value={userInfo.phone} 
            />
            
            <EditableField 
              field="location" 
              label="Location" 
              value={userInfo.location} 
              multiline={true}
            />
          </div>
        </div>
        {registerError && <p className="text-red-500">{registerError}</p>}
      </div>
      {showModal && <BecomeAMerchant onRegister={handleRegister} />}
    </section>
  );
}