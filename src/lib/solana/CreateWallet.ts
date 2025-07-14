import { privy } from "../privyClient";

/**
 * Creates an embedded wallet for the authenticated user if one doesn't exist.
 * @param idToken The user's Privy ID token (from cookies or frontend).
 * @returns The wallet info or error
 */
export async function CreateWallet(idToken: string) {
  if (!idToken) throw new Error("Missing ID token");

  const user = await privy.getUser({ idToken });
  if (!user || !user.id) {
    throw new Error("Invalid or unauthenticated user");
  }

  if (user.wallet?.address) {
    return {
      status: "exists",
      wallet: user.wallet,
    };
  }

  // const {id, address, chainType} = await privy.walletApi.create({chainType: 'solana'});

  const wallet = await privy.walletApi.createEmbeddedWallet({
    userId: user.id,
    chain: "sol",
  });

  return {
    status: "created",
    wallet,
  };
}
