import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import DailyClaim from "@/lib/models/DailyClaim";
import { IUser, User } from "@/lib/models/User";
import { logger } from "@/lib/logger";

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

    const daily = await DailyClaim.findOne({ userId: localUser._id });

    const now = new Date();
    const lastClaimedAt = daily?.lastClaimedAt ?? null;

    let canClaim = true;
    let countdown = 0;

    if (lastClaimedAt) {
      const nextClaimAt = new Date(lastClaimedAt);
      nextClaimAt.setDate(nextClaimAt.getDate() + 1);

      if (now < nextClaimAt) {
        canClaim = false;
        countdown = Math.floor((nextClaimAt.getTime() - now.getTime()) / 1000);
      }
    }

    return NextResponse.json({
      success: true,
      canClaim,
      countdown,
      lastClaimedAt,
      streak: daily?.streak ?? 0,
    });
  } catch (error) {
    logger.error("GET /api/daily-claim/status error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
