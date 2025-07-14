import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Mainnet USDC
// const USDC_MINT = new PublicKey("BQ1UuSqKXnTHJMgtrtxXJgqzoWszSKBNk3CZyJwGeMec"); // Devnet USDC (commented)

export async function GET() {
  try {
    await connectDB();

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
    if (walletAddress) {
      // Mainnet connection
      const connection = new Connection("https://api.mainnet-beta.solana.com");

      // const connection = new Connection("https://api.devnet.solana.com"); // Devnet alternative

      const publicKey = new PublicKey(walletAddress);

      // Fetch SOL balance
      const solLamports = await connection.getBalance(publicKey);
      balances.sol = (solLamports / 1e9).toFixed(3); // Convert lamports to SOL

      try {
        // Fetch USDC SPL token balance
        const usdcTokenAccount = await getAssociatedTokenAddress(
          USDC_MINT,
          publicKey
        );
        const accountInfo = await getAccount(connection, usdcTokenAccount);
        balances.usdc = (Number(accountInfo.amount) / 1e6).toFixed(2); // USDC has 6 decimals
      } catch (err) {
        // Token account may not exist
        balances.usdc = "0";
      }
    }

    const compiled =
      parseFloat(balances.cls) * 0.02 +
      parseFloat(balances.usdc) +
      parseFloat(balances.sol) * 0.005915;

    balances.compiled = String(compiled);

    return NextResponse.json({ success: true, balances });
  } catch (error) {
    console.error("GET /api/user/balances error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
