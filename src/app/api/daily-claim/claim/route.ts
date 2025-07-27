import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import DailyClaim from "@/lib/models/DailyClaim";
import { User } from "@/lib/models/User";
import { logger } from "@/lib/logger";
import { logBalanceTransaction } from "@/lib/helpers/logBalanceTransaction";

export async function POST() {
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

    const localUser = await User.findOne({ privyId: privyUser.id });

    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const daily = await DailyClaim.findOne({ userId: localUser._id });

    if (daily) {
      const nextClaimAt = new Date(daily.lastClaimedAt);
      nextClaimAt.setDate(nextClaimAt.getDate() + 1);

      if (now < nextClaimAt) {
        const wait = Math.floor((nextClaimAt.getTime() - now.getTime()) / 1000);
        return NextResponse.json(
          { success: false, message: "Already claimed", countdown: wait },
          { status: 400 }
        );
      }

      daily.lastClaimedAt = now;
      daily.streak += 1;
      await daily.save();
    } else {
      await DailyClaim.create({
        userId: localUser._id,
        lastClaimedAt: now,
        streak: 1,
      });
    }

    localUser.balance += 5;
    await localUser.save();

    await logBalanceTransaction({
      userId: localUser._id,
      type: "daily_login",
      amount: 3,
    });

    return NextResponse.json({
      success: true,
      message: "Claimed successfully",
      reward: 5,
    });
  } catch (error) {
    logger.error("POST /api/daily-claim/claim error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
