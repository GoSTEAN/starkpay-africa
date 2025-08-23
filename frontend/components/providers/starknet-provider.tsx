"use client";

import React from "react";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { jsonRpcProvider, StarknetConfig } from "@starknet-react/core";
import { publicProvider } from "@starknet-react/core";
import { Connector, voyager } from "@starknet-react/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import { ArgentMobileConnector } from "starknetkit/argentMobile";

interface StarknetProviderProps {
  children: React.ReactNode;
}

const chains = [mainnet];

const connectors = [
  new InjectedConnector({
      options: { id: "argentX", name: "Argent X" },
    }),
    new InjectedConnector({
      options: { id: "braavos", name: "Braavos" },
    }),
]

const StarknetProvider: React.FC<StarknetProviderProps> = ({ children }) => {
  const connectors = [
    new InjectedConnector({
      options: { id: "argentX", name: "Argent X" },
    }),
    new InjectedConnector({
      options: { id: "braavos", name: "Braavos" },
    }),
    new InjectedConnector({
      options: { id: "metamask", name: "MetaMask" },
    }),
    new InjectedConnector({
      options: { id: "keplr", name: "Keplr" },
    }),
    new InjectedConnector({
      options: { id: "okxwallet", name: "OKX" },
    }),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ArgentMobileConnector.init({
      options: {
        dappName: "Swift",
        url: "https://web.argent.xyz",
      },
    }),
  ];

  return (
    <StarknetConfig
      chains={chains}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
      provider={jsonRpcProvider({
        rpc: () => ({nodeUrl: process.env.NEXT_PUBLIC_RPC_URL})
      })}
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
