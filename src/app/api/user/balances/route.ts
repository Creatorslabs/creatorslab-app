import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { getConnection } from "@/lib/solana/getConnection";
import { logger } from "@/lib/logger";

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const USDC_MINT_DEV = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);
const solPriceInUSD = 157.34;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const networkParam = req.nextUrl.searchParams.get("network");

    // Validate and fallback
    const network =
      networkParam === "devnet" ||
      networkParam === "mainnet-beta" ||
      networkParam === "testnet"
        ? networkParam
        : "mainnet-beta";

    const connection = getConnection(network);

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });

    if (!privyUser?.id) {
      return NextResponse.json(
        { message: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const localUser = await User.findOne({
      privyId: privyUser.id,
    }).lean<IUser>();

    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const balances = {
      compiled: "0",
      sol: "0",
      usdc: "0",
      cls: localUser.balance?.toString() || "0",
    };

    const walletAddress = privyUser.wallet?.address;
    const usdcMint = network === "devnet" ? USDC_MINT_DEV : USDC_MINT;
    if (walletAddress) {
      const publicKey = new PublicKey(walletAddress);

      const solLamports = await connection.getBalance(publicKey);
      balances.sol = (solLamports / 1e9).toFixed(3);

      try {
        const usdcTokenAccount = await getAssociatedTokenAddress(
          usdcMint,
          publicKey
        );
        const accountInfo = await getAccount(connection, usdcTokenAccount);
        balances.usdc = (Number(accountInfo.amount) / 1e6).toFixed(2);
      } catch (err) {
        balances.usdc = "0";
      }
    }

    if (walletAddress && !localUser.wallet) {
      await User.findOneAndUpdate(
        { privyId: privyUser.id },
        { wallet: walletAddress },
        { new: true }
      );
    }

    const compiled =
      parseFloat(balances.cls) * 0.02 +
      parseFloat(balances.usdc) +
      parseFloat(balances.sol) * solPriceInUSD;

    balances.compiled = String(compiled.toFixed(3));

    return NextResponse.json({ success: true, balances });
  } catch (error) {
    logger.error("GET /api/user/balances error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
