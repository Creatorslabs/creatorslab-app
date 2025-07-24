import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import { logger } from "@/lib/logger";

export async function PATCH() {
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

    if (!privyUser.wallet) {
      return NextResponse.json(
        { message: "No wallet found!" },
        { status: 401 }
      );
    }

    const user = await User.findOneAndUpdate(
      { privyId: privyUser.id },
      { wallet: privyUser?.wallet.address },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Wallet saved successfully",
      user: {
        id: user._id,
        wallet: user.wallet,
      },
    });
  } catch (err) {
    logger.error("Error saving wallet:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
