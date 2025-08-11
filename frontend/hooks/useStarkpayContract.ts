import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

export const STARKPAY_ABI: Abi =[
  {
    "type": "impl",
    "name": "StarkpayImpl",
    "interface_name": "starkpay_africa::interface::IStarkpay::IStarkpay"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "starkpay_africa::interface::IStarkpay::IStarkpay",
    "items": [
      {
        "type": "function",
        "name": "create_payment",
        "inputs": [
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "remarks",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "receive_payment",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "deposit",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "withdrawal",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_balance",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "create_sme",
        "inputs": [
          {
            "name": "recipients",
            "type": "core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u8)>"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "process_split",
        "inputs": [
          {
            "name": "sme_id",
            "type": "core::integer::u256"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "register",
        "inputs": [
          {
            "name": "is_merchant",
            "type": "core::bool"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_user_role",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "usdc",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "usdt",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "strk",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "starkpay_africa::starkpay::Starkpay::PaymentRequestCreated",
    "kind": "struct",
    "members": [
      {
        "name": "request_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "merchant",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "remarks",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "ngn_equivalent",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starkpay_africa::starkpay::Starkpay::DepositEvent",
    "kind": "struct",
    "members": [
      {
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starkpay_africa::starkpay::Starkpay::SmeCreated",
    "kind": "struct",
    "members": [
      {
        "name": "sme_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "merchant",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "recipients",
        "type": "core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u8)>",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starkpay_africa::starkpay::Starkpay::SplitProcessed",
    "kind": "struct",
    "members": [
      {
        "name": "sme_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "merchant",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "total_amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starkpay_africa::starkpay::Starkpay::PaymentReceived",
    "kind": "struct",
    "members": [
      {
        "name": "request_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "payer",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "starkpay_africa::starkpay::Starkpay::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "PaymentRequestCreated",
        "type": "starkpay_africa::starkpay::Starkpay::PaymentRequestCreated",
        "kind": "nested"
      },
      {
        "name": "DepositEvent",
        "type": "starkpay_africa::starkpay::Starkpay::DepositEvent",
        "kind": "nested"
      },
      {
        "name": "SmeCreated",
        "type": "starkpay_africa::starkpay::Starkpay::SmeCreated",
        "kind": "nested"
      },
      {
        "name": "SplitProcessed",
        "type": "starkpay_africa::starkpay::Starkpay::SplitProcessed",
        "kind": "nested"
      },
      {
        "name": "PaymentReceived",
        "type": "starkpay_africa::starkpay::Starkpay::PaymentReceived",
        "kind": "nested"
      }
    ]
  }
] as const;

export const STARKPAY_CONTRACT_ADDRESS = "0x05d5a32802a2260e9ac978fb2eb33f8295dea0aaeed9ab512378df96081aa5b5"; 

export function useStarkpayContract() {
  const { contract } = useContract({
    abi: STARKPAY_ABI,
    address: STARKPAY_CONTRACT_ADDRESS,
  });

  return contract;
}
