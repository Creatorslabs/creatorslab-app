import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
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

    const localUser = await User.findOne({ privyId: privyUser.id }).lean();

    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: localUser });
  } catch (error) {
    logger.error("GET /api/user/me error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
