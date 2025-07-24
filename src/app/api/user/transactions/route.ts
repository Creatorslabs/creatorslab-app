import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import { format } from "date-fns";
import { logger } from "@/lib/logger";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const HELIUS_MAINNET = `https://api.helius.xyz/v0/addresses`;
const HELIUS_DEVNET = `https://api-devnet.helius.xyz/v0/addresses`;

export async function GET(req: NextRequest) {
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
    const walletAddress = privyUser?.wallet?.address;

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const ENDPOINT = network === "devnet" ? HELIUS_DEVNET : HELIUS_MAINNET;
    const limit = 10;

    const url = `${ENDPOINT}/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const txs = await response.json();

    const formatted = txs
      .map((tx: any) => {
        let type = tx.type || "unknown";
        let sender = "";
        let receiver = "";
        let currency = "SOL";
        let amount = tx.nativeTransfers?.[0]?.amount || "0";

        const desc = tx.description || "";
        const lowerDesc = desc.toLowerCase();

        logger.log(
          "[TX_API_GET] tx:",
          `Type:${tx.type} - Description: ${tx.description}`
        );

        if (type === "NFT_SALE" && desc.includes("sold nft to")) {
          const match = desc.match(
            /(\w{32,}) sold nft to (\w{32,}) for ([\d.]+) (\w+)/
          );
          if (match) {
            sender = match[1];
            receiver = match[2];
            amount = match[3];
            currency = match[4];
            type = "nft_sale";
          }
        } else if (type === "NFT_LISTING" && desc.includes("listed nft for")) {
          const match = desc.match(/(\w{32,}) listed nft for ([\d.]+) (\w+)/);
          if (match) {
            sender = match[1];
            amount = match[2];
            currency = match[3];
            type = "nft_listing";
          }
        } else if (type === "COMPRESSED_NFT_MINT" && desc.includes("minted")) {
          const match = desc.match(/(\w{32,}) minted (\d+) compressed nfts/);
          if (match) {
            sender = match[1];
            amount = match[2];
            currency = "NFT";
            type = "compressed_nft_mint";
          }
        } else if (type === "TRANSFER" && desc.includes("transferred")) {
          const match = desc.match(
            /(\w{32,}) transferred a total ([\d.]+) (\w+) to/
          );
          if (match) {
            sender = match[1];
            amount = match[2];
            currency = match[3];

            if (sender === walletAddress) {
              type = "send";
            } else {
              type = "receive";
            }
          }
        }

        const numericAmount = parseFloat(amount || "0");
        const isMint = type === "compressed_nft_mint";
        const isRealTransaction = isMint || numericAmount > 0.00001;

        if (!isRealTransaction) return null;

        return {
          id: tx.signature,
          type,
          amount,
          currency:
            currency === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
              ? "USDC"
              : currency.toUpperCase(),
          timestamp: format(
            new Date(tx.timestamp * 1000),
            "yyyy-MM-dd HH:mm:ss"
          ),
          sender,
          receiver,
          interface: "sol",
        };
      })
      .filter(Boolean);

    return NextResponse.json({ transactions: formatted });
  } catch (err) {
    logger.error("[TX_API_GET]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
