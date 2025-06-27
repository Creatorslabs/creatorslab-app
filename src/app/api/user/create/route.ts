import connectDB from "@/lib/connectDB";
import { generateReferralCode } from "@/lib/helpers/generate-referal-code";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { privyId, email } = body;

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
      username: email?.split("@")[0] || `user_${Math.floor(Math.random() * 10000)}`,
      role: "user",
      status: "Active",
      referralCode: generateReferralCode(),
      balance: 3,
      lastLoginDate: new Date(),
      verification: {
        email: !!email,
        twitter: false,
        discord: false,
      },
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (err) {
    console.error("User creation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
