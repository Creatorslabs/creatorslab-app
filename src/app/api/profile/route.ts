import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getLoggedInUser } from "@/lib/auth/getUser";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verified =
      user.verification?.twitter &&
      user.verification?.discord &&
      user.verification?.email;

    const responseData = {
      id: user._id.toString(),
      name: user.username || "Unnamed",
      username: user.username || "unknown",
      avatar: user.image || "/default-avatar.png",
      verified,
      email: user.email || "",
      inviteLink: `${process.env.NEXTAUTH_URL}/auth/signup?ref=${user.referralCode}`,
      balance: user.balance?.toFixed(1) || "0.0",
      role: user.role || "user",
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    logger.error("GET /api/user/info error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
