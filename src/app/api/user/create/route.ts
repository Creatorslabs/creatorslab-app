import connectDB from "@/lib/connectDB";
import { generateReferralCode } from "@/lib/helpers/generate-referal-code";
import { logBalanceTransaction } from "@/lib/helpers/logBalanceTransaction";
import { logger } from "@/lib/logger";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { privyId, email, role } = body;

    if (!privyId) {
      return NextResponse.json({ error: "Missing Privy ID" }, { status: 400 });
    }

    const existing = await User.findOne({ privyId });
    if (existing) {
      return NextResponse.json({ message: "User already exists" });
    }

    const newUser = await User.create({
      privyId,
      email: email || null,
      username:
        email?.split("@")[0] || `user_${Math.floor(Math.random() * 10000)}`,
      role,
      status: "Active",
      referralCode: generateReferralCode(),
      balance: role === "creator" ? 50 : 10,
      lastLoginDate: new Date(),
      verification: {
        email: !!email,
        twitter: false,
        discord: false,
      },
    });

    await logBalanceTransaction({
      userId: newUser._id,
      type: "signup_bonus",
      amount: 3,
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (err) {
    logger.error("User creation error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
