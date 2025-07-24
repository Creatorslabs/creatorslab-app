import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("privy-id-token")?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await privy.getUser({ idToken });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.wallet?.address) {
      return NextResponse.json({
        message: "User already has a wallet",
        wallet: user.wallet,
      });
    }

    const createdWallet = await privy.walletApi.createWallet({
      chainType: "solana",
    });

    return NextResponse.json({
      message: "Wallet created successfully",
      wallet: createdWallet,
    });
  } catch (err: any) {
    logger.error("Wallet creation failed:", err);
    return NextResponse.json(
      { message: err.message || "Wallet creation failed" },
      { status: 500 }
    );
  }
}
