"use client";
import { useState, useMemo, useCallback } from "react";
import type { Connection } from "@solana/web3.js";
import { getConnection } from "@/lib/solana/getConnection";

type Network = "devnet" | "mainnet-beta" | "testnet";

export function useSolanaConnection(defaultNetwork: Network = "devnet") {
  const [network, setNetwork] = useState<Network>(defaultNetwork);

  const connection: Connection = useMemo(() => {
    return getConnection(network);
  }, [network]);

  const changeNetwork = useCallback((newNetwork: Network) => {
    setNetwork(newNetwork);
  }, []);

  return { connection, network, setNetwork: changeNetwork };
}
