import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

export const STARKPAY_ABI: Abi = [
  {
    name: "StarkpayImpl",
    type: "impl",
    interface_name: "starkpay_africa::interface::IStarkpay::IStarkpay",
  },
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "starkpay_africa::types::data::Role",
    type: "enum",
    variants: [
      {
        name: "None",
        type: "()",
      },
      {
        name: "Merchant",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "Admin",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "User",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    name: "starkpay_africa::interface::IStarkpay::IStarkpay",
    type: "interface",
    items: [
      {
        name: "create_payment",
        type: "function",
        inputs: [
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "remarks",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "receive_payment",
        type: "function",
        inputs: [
          {
            name: "request_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "deposit",
        type: "function",
        inputs: [
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "withdrawal",
        type: "function",
        inputs: [
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "get_balance",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "create_sme",
        type: "function",
        inputs: [
          {
            name: "recipients",
            type: "core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u8)>",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "process_split",
        type: "function",
        inputs: [
          {
            name: "sme_id",
            type: "core::integer::u256",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "token",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "register",
        type: "function",
        inputs: [
          {
            name: "role",
            type: "starkpay_africa::types::data::Role",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "usdc",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "usdt",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "strk",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "starkpay_africa::starkpay::Starkpay::PaymentRequestCreated",
    type: "event",
    members: [
      {
        kind: "data",
        name: "request_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "merchant",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "receiver",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "remarks",
        type: "core::felt252",
      },
      {
        kind: "data",
        name: "ngn_equivalent",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "starkpay_africa::starkpay::Starkpay::DepositEvent",
    type: "event",
    members: [
      {
        kind: "data",
        name: "caller",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "starkpay_africa::starkpay::Starkpay::SmeCreated",
    type: "event",
    members: [
      {
        kind: "data",
        name: "sme_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "merchant",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "recipients",
        type: "core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u8)>",
      },
    ],
  },
  {
    kind: "struct",
    name: "starkpay_africa::starkpay::Starkpay::SplitProcessed",
    type: "event",
    members: [
      {
        kind: "data",
        name: "sme_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "merchant",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "total_amount",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "starkpay_africa::starkpay::Starkpay::PaymentReceived",
    type: "event",
    members: [
      {
        kind: "data",
        name: "request_id",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "payer",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "enum",
    name: "starkpay_africa::starkpay::Starkpay::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "PaymentRequestCreated",
        type: "starkpay_africa::starkpay::Starkpay::PaymentRequestCreated",
      },
      {
        kind: "nested",
        name: "DepositEvent",
        type: "starkpay_africa::starkpay::Starkpay::DepositEvent",
      },
      {
        kind: "nested",
        name: "SmeCreated",
        type: "starkpay_africa::starkpay::Starkpay::SmeCreated",
      },
      {
        kind: "nested",
        name: "SplitProcessed",
        type: "starkpay_africa::starkpay::Starkpay::SplitProcessed",
      },
      {
        kind: "nested",
        name: "PaymentReceived",
        type: "starkpay_africa::starkpay::Starkpay::PaymentReceived",
      },
    ],
  },
] as const;

export const STARKPAY_CONTRACT_ADDRESS = "0x05d5a32802a2260e9ac978fb2eb33f8295dea0aaeed9ab512378df96081aa5b5"; 

export function useStarkpayContract() {
  const { contract } = useContract({
    abi: STARKPAY_ABI,
    address: STARKPAY_CONTRACT_ADDRESS,
  });

  return contract;
}
