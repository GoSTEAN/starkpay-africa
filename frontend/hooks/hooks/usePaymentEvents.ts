import { useContract } from "@starknet-react/core";
import { useStarkpayContract } from "../useStarkpayContract";
import { useEffect } from "react";

export function usePaymentEvents(address: string, callback: (event: any) => void) {
  const contract = useStarkpayContract();

  useEffect(() => {
    if (!contract || !address) return;

    const filter = {
      address: contract.address,
      keys: [/* filter keys if needed */],
      from_block: "latest",
    };

    const eventHandler = (events: any[]) => {
      events.forEach((event) => {
        if (event.name === "PaymentReceived") {
          callback(event);
        }
      });
    };

    contract.on(filter, eventHandler);

    return () => {
      contract.off(filter, eventHandler);
    };
  }, [contract, address, callback]);
}