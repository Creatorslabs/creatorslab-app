export const runtime = "nodejs";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { privy } from "@/lib/privyClient";
import { User } from "@/lib/models/User";

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
      return NextResponse.json({ message: "Invalid user" }, { status: 401 });
    }

    const user = await User.findOne({ privyId: privyUser.id });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update verification status
    const updatedVerification = {
      twitter: !!privyUser.twitter?.username,
      discord: !!privyUser.discord?.username,
      email: !!privyUser.email?.address,
    };

    user.verification = updatedVerification;

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/user/verify error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
