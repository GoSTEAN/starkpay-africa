// app/api/swap/execute/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AutoSwappr, TOKEN_ADDRESSES } from 'autoswap-sdk';

const TOKEN_DECIMALS = {
  [TOKEN_ADDRESSES.STRK]: 18,
  [TOKEN_ADDRESSES.USDC]: 6,
  ["0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"]: 6,
};

export async function POST(request: NextRequest) {
  try {
    const { fromCurrency, toCurrency, amount } = await request.json();

    // Validate environment variables
    const contractAddress = process.env.AUTOSWAPPR_CONTRACT_ADDRESS;
    const rpcUrl = process.env.STARKNET_RPC_URL;
    const accountAddress = process.env.ACCOUNT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (!contractAddress || !rpcUrl || !accountAddress || !privateKey) {
      return NextResponse.json(
        { error: 'Server configuration missing' },
        { status: 500 }
      );
    }

    if (!fromCurrency || !toCurrency || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Initialize AutoSwappr
    const autoswappr = new AutoSwappr({
      contractAddress,
      rpcUrl,
      accountAddress,
      privateKey,
    });

    // Get token addresses
    const tokenAddresses: { [key: string]: string } = {
      STRK: TOKEN_ADDRESSES.STRK,
      USDC: TOKEN_ADDRESSES.USDC,
      USDT: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    };

    const tokenInAddr = tokenAddresses[fromCurrency];
    const tokenOutAddr = tokenAddresses[toCurrency];

    if (!tokenInAddr || !tokenOutAddr) {
      return NextResponse.json(
        { error: 'Unsupported currency' },
        { status: 400 }
      );
    }

    // Convert amount to wei
    const decimals = TOKEN_DECIMALS[tokenInAddr];
    const parsedAmount = parseFloat(amount);
    const amountWei = BigInt(Math.floor(parsedAmount * 10 ** decimals)).toString();

    // Execute swap
    const result = await autoswappr.executeSwap(tokenInAddr, tokenOutAddr, {
      amount: amountWei,
      isToken1: tokenInAddr > tokenOutAddr,
    });

    return NextResponse.json({
      transactionHash: result.result.transaction_hash,
      success: true
    });

  } catch (error: any) {
    console.error('Swap execution error:', error);
    return NextResponse.json(
      { error: error.message || 'Swap execution failed' },
      { status: 500 }
    );
  }
}