"use client";
import { useState, useMemo, useCallback } from "react";
import { Connection } from "@solana/web3.js";

const RPC_ENDPOINTS = {
  devnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
};

type Network = keyof typeof RPC_ENDPOINTS;

export function useSolanaConnection(defaultNetwork: Network = "devnet") {
  const [network, setNetwork] = useState<Network>(defaultNetwork);

  // Create a new Connection object whenever the network changes
  const connection = useMemo(() => {
    const url = RPC_ENDPOINTS[network];
    return new Connection(url, "confirmed");
  }, [network]);

  // Toggle or explicitly change network
  const changeNetwork = useCallback((newNetwork: Network) => {
    setNetwork(newNetwork);
  }, []);

  return { connection, network, setNetwork: changeNetwork };
}
