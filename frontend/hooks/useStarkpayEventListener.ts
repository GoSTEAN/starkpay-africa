import { useEffect, useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import { Contract, RpcProvider, num, hash } from "starknet";
import { STARKPAY_ABI } from "./useStarkpayContract";
import { TOKEN_ADDRESSES } from "autoswap-sdk";

const STARKPAY_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x01f7d31c6f11046029310be2e7810189eb6b4581049b4d35047fbc8e42ab75a4";

export function useStarkpayEventListener(
  addNotification: (notification: any) => void,
  onTransaction: (transaction: any) => void,
  pendingTransactions: any[]
) {
  const { address } = useAccount();
  const { provider } = useProvider();
  const [events, setEvents] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!address || !provider) {
      console.warn("No wallet address or provider available for event listening");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Event Listener Error",
        message: "Wallet not connected or provider unavailable",
        timestamp: new Date(),
        read: false,
        category: "system",
      });
      return;
    }

    // Initialize provider with fallback to HTTP
    const httpUrl = process.env.NEXT_PUBLIC_RPC_URL;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!httpUrl) {
      console.error("NEXT_PUBLIC_RPC_URL is not defined");
      addNotification({
        id: Date.now(),
        type: "error",
        title: "Configuration Error",
        message: "RPC URL is not defined in environment variables",
        timestamp: new Date(),
        read: false,
        category: "system",
      });
      return;
    }

    const providerOptions = wsUrl
      ? { nodeUrl: wsUrl, fallback: { nodeUrl: httpUrl } }
      : { nodeUrl: httpUrl };
    const eventProvider = new RpcProvider(providerOptions);

    const contract = new Contract(STARKPAY_ABI, STARKPAY_CONTRACT_ADDRESS, eventProvider);

    // Calculate hashed event keys
    const paymentRequestCreatedKey = num.toHex(hash.starknetKeccak("PaymentRequestCreated"));
    const paymentReceivedKey = num.toHex(hash.starknetKeccak("PaymentReceived"));

    const pollEvents = async () => {
      try {
        setIsListening(true);
        const block = await eventProvider.getBlock("latest");
        const events = await eventProvider.getEvents({
          from_block: { block_number: Math.max(0, block.block_number - 50) },
          to_block: "latest",
          address: STARKPAY_CONTRACT_ADDRESS,
          keys: [[paymentRequestCreatedKey], [paymentReceivedKey]],
          chunk_size: 50,
        });

        // Process PaymentRequestCreated events
        const paymentRequestEvents = events.events
          .filter((event: any) =>
            event.keys.includes(paymentRequestCreatedKey)
          )
          .map((event: any) => ({
            requestId: event.data[0],
            merchant: event.data[1],
            receiver: event.data[2],
            amount: event.data[3],
            token: event.data[4],
            remarks: event.data[5],
            transactionHash: event.transaction_hash,
            timestamp: new Date(),
          }))
          .filter((event: any) => event.merchant === address || event.receiver === address);

        // Process PaymentReceived events
        const paymentReceivedEvents = events.events
          .filter((event: any) => event.keys.includes(paymentReceivedKey))
          .map((event: any) => ({
            requestId: event.data[0],
            payer: event.data[1],
            merchant: event.data[2],
            amount: event.data[3],
            netAmount: event.data[4],
            transactionHash: event.transaction_hash,
            timestamp: new Date(),
          }))
          .filter((event: any) => event.merchant === address);

        // Update pending transactions for PaymentReceived
        paymentReceivedEvents.forEach((event: any) => {
          const matchingTx = pendingTransactions.find(
            (tx) => tx.paymentId === event.requestId.toString()
          );
          if (matchingTx && matchingTx.status === "pending") {
            // Convert amount back to readable format
            const decimals = {
              [TOKEN_ADDRESSES.USDT]: 6,
              [TOKEN_ADDRESSES.USDC]: 6,
              [TOKEN_ADDRESSES.STRK]: 18,
            }[matchingTx.currency] || 18;
            const amount = Number(event.amount) / 10 ** decimals;

            const updatedTx = {
              ...matchingTx,
              status: "success",
              completedAt: event.timestamp,
              transactionHash: event.transactionHash,
              amount: amount.toString(),
            };

            // Update parent components
            onTransaction(updatedTx);
            addNotification({
              id: Date.now(),
              type: "success",
              title: "Payment Received",
              message: `Received ${amount} ${matchingTx.currency} (Tx: ${event.transactionHash.slice(0, 8)}...)`,
              timestamp: event.timestamp,
              read: false,
              category: "qr_code",
              amount: amount.toString(),
              currency: matchingTx.currency,
              status: "success",
            });

            // Show alert
            alert(`Payment Received: ${amount} ${matchingTx.currency} (Tx: ${event.transactionHash.slice(0, 8)}...)`);
          }
        });

        setEvents([...paymentRequestEvents, ...paymentReceivedEvents]);
      } catch (error: any) {
        console.error("Detailed event polling error:", {
          message: error.message,
          stack: error.stack,
          contractAddress: STARKPAY_CONTRACT_ADDRESS,
          rpcUrl: httpUrl,
          wsUrl: wsUrl,
        });
        addNotification({
          id: Date.now(),
          type: "error",
          title: "Event Polling Error",
          message: `Failed to fetch payment events: ${error.message || "Unknown error"}`,
          timestamp: new Date(),
          read: false,
          category: "system",
        });
      }
    };

    // Poll every 15 seconds to avoid rate limits
    const interval = setInterval(pollEvents, 15000);

    // Initial poll
    pollEvents();

    return () => {
      clearInterval(interval);
      setIsListening(false);
    };
  }, [address, provider, pendingTransactions, addNotification, onTransaction]);

  return { events, isListening };
}