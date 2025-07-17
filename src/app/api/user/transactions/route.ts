import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_ENDPOINT = `https://api.helius.xyz/v0/addresses`;
const HELIUS_ENDPOINT_DEV = `https://api-devnet.helius.xyz/v0/addresses`;

export async function POST(req: NextRequest) {
  try {
    const networkParam = req.nextUrl.searchParams.get("network");

    const network =
      networkParam === "devnet" ||
      networkParam === "mainnet-beta" ||
      networkParam === "testnet"
        ? networkParam
        : "mainnet";

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });

    if (!privyUser?.wallet?.address) {
      return NextResponse.json(
        { message: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const walletAddress = privyUser.wallet.address;

    const { cursor } = await req.json();
    const limit = 10; // force limit to 10

    const ENDPOINT =
      network === "devnet" ? HELIUS_ENDPOINT_DEV : HELIUS_ENDPOINT;

    const url = `${ENDPOINT}/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}${
      cursor ? `&before=${cursor}` : ""
    }`;

    const heliusRes = await fetch(url);
    if (!heliusRes.ok) throw new Error("Failed to fetch transactions");

    const txs = await heliusRes.json();

    const formatted = txs.slice(0, 10).map((tx: any) => ({
      id: tx.signature,
      type: tx.type || "unknown",
      amount: tx.nativeTransfers?.[0]?.amount || "0",
      currency: "SOL",
      timestamp: new Date(tx.timestamp * 1000),
      description: tx.description || tx.type,
    }));

    return NextResponse.json({
      transactions: formatted,
      pagination: {
        hasNextPage: txs.length === limit,
        hasPreviousPage: !!cursor,
        nextCursor:
          txs.length === limit ? txs[txs.length - 1]?.signature : null,
        currentCursor: cursor || null,
      },
    });
  } catch (err) {
    console.error("[TX_API]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
