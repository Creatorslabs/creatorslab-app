import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Participation } from "@/lib/models/Participation";
import { privy } from "@/lib/privyClient";
import "@/lib/models/Task";
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

    const dbUser = await User.findOne({ privyId: privyUser.id }).lean<IUser>();

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isVerified =
      dbUser.verification?.twitter &&
      dbUser.verification?.discord &&
      dbUser.verification?.email;

    const participations = await Participation.find({
      userId: dbUser._id.toString(),
      status: "pending",
    })
      .populate("taskId")
      .lean();

    const pendingClaims = participations.map((p: any) => {
      const task = p.taskId;
      return {
        id: p._id.toString(),
        task: task?.title || "Untitled task",
        amount: task?.reward || "$CLS 0.00",
        icon: task?.icon || "🎯",
      };
    });

    const response = {
      id: dbUser._id.toString(),
      name: dbUser.username || "Unnamed",
      username: dbUser.username || "unknown",
      avatar: dbUser.image || "/default-avatar.png",
      verified: isVerified,
      email: dbUser.email || "",
      inviteLink: `${process.env.NEXTAUTH_URL}/auth/signup/${dbUser.referralCode}`,
      balance: dbUser.balance?.toFixed(1) || "0.0000",
      pendingClaims,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    logger.error("GET /api/user/profile error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
