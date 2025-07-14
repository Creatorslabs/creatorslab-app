import { Connection, clusterApiUrl } from "@solana/web3.js";

/**
 * Returns a new Solana connection.
 * Safe for both client and server usage.
 * @param network solana network: "devnet" | "mainnet-beta" | "testnet"
 */
export function getConnection(
  network: "devnet" | "mainnet-beta" | "testnet" = "mainnet-beta"
) {
  return new Connection(clusterApiUrl(network), "confirmed");
}
