import { uint256 } from "starknet";

export function formatStarknetAmount(amount: bigint, decimals: number): string {
  return (Number(amount) / 10 ** decimals).toFixed(decimals);
}

export function parseStarknetAmount(amount: string, decimals: number): bigint {
  return BigInt(Math.floor(Number(amount) * 10 ** decimals));
}

export function formatUint256(value: { low: bigint, high: bigint }): bigint {
  return uint256.uint256ToBN(value);
}

export function handleStarknetError(error: any): string {
  if (error.message.includes("user rejected")) {
    return "Transaction was rejected";
  }
  if (error.message.includes("insufficient funds")) {
    return "Insufficient funds for transaction";
  }
  if (error.message.includes("max fee")) {
    return "Transaction fee too low";
  }
  return "Transaction failed. Please try again.";
}