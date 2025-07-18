import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import { format } from "date-fns";

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

    const formatted = txs.map((tx: any) => {
      let type = tx.type || "unknown";
      let sender = "";
      let receiver = "";
      let currency = "SOL";
      let amount = tx.nativeTransfers?.[0]?.amount || "0";

      if (type === "TRANSFER" && tx.description) {
        const matches = tx.description.match(
          /(\w{32,}) transferred ([\d.]+) (\w+) to (\w{32,})/
        );
        if (matches) {
          sender = matches[1];
          amount = matches[2];
          currency = matches[3];
          receiver = matches[4];

          if (sender === walletAddress) {
            type = "send";
          } else if (receiver === walletAddress) {
            type = "receive";
          }
        }
      }

      return {
        id: tx.signature,
        type,
        amount,
        currency:
          currency === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
            ? "USDC"
            : currency.toUpperCase(),
        timestamp: format(new Date(tx.timestamp * 1000), "yyyy-MM-dd HH:mm:ss"),
        sender,
        receiver,
      };
    });

    return NextResponse.json({ transactions: formatted });
  } catch (err) {
    console.error("[TX_API_GET]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
