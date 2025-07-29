"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { Connection } from "@solana/web3.js";
import { getConnection } from "@/lib/solana/getConnection";

type Network = "devnet" | "mainnet-beta" | "testnet";

type SolanaConnectionContextType = {
  connection: Connection;
  network: Network;
  setNetwork: (network: Network) => void;
};

const SolanaConnectionContext = createContext<
  SolanaConnectionContextType | undefined
>(undefined);

export const SolanaConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [network, setNetwork] = useState<Network>("mainnet-beta");

  const connection = useMemo(() => getConnection(network), [network]);

  const handleSetNetwork = useCallback((newNetwork: Network) => {
    setNetwork(newNetwork);
  }, []);

  const value = useMemo(
    () => ({ connection, network, setNetwork: handleSetNetwork }),
    [connection, network, handleSetNetwork]
  );

  return (
    <SolanaConnectionContext.Provider value={value}>
      {children}
    </SolanaConnectionContext.Provider>
  );
};

export const useSolanaConnection = () => {
  const context = useContext(SolanaConnectionContext);
  if (!context) {
    throw new Error(
      "useSolanaConnection must be used within a SolanaConnectionProvider"
    );
  }
  return context;
};
