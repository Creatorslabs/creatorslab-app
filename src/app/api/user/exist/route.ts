import connectDB from "@/lib/connectDB";
import { generateReferralCode } from "@/lib/helpers/generate-referal-code";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Missing email from request" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });

    return NextResponse.json({ exist: !!existing });
  } catch (err) {
    console.error("User creation error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
