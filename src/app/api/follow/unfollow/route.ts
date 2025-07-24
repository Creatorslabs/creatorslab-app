import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Follow } from "@/lib/models/Follow";
import { logBalanceTransaction } from "@/lib/helpers/logBalanceTransaction";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
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

    const authUser = await User.findOne({
      privyId: privyUser.id,
    }).lean<IUser>();
    if (!authUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { creatorId } = await req.json();

    if (authUser._id.toString() === creatorId) {
      return NextResponse.json(
        { message: "Cannot unfollow yourself" },
        { status: 400 }
      );
    }

    const [creator, existingFollow] = await Promise.all([
      User.findById(creatorId).select("role").lean<IUser>(),
      Follow.findOne({
        followerId: authUser._id,
        followingId: creatorId,
      }).lean<IUser>(),
    ]);

    if (!creator) {
      return NextResponse.json(
        { message: "Creator not found" },
        { status: 404 }
      );
    }

    if (creator.role !== "creator") {
      return NextResponse.json(
        { message: "Target user is not a creator" },
        { status: 400 }
      );
    }

    if (!existingFollow) {
      return NextResponse.json({ message: "Not following" }, { status: 404 });
    }

    if ((authUser.balance || 0) < 5) {
      return NextResponse.json(
        { message: "Insufficient balance to unfollow (requires 5 CLS)" },
        { status: 403 }
      );
    }

    await Promise.all([
      Follow.deleteOne({
        followerId: authUser._id,
        followingId: creatorId,
      }),
      User.findByIdAndUpdate(authUser._id, {
        $inc: { balance: -5 },
      }),
    ]);

    await logBalanceTransaction({
      userId: authUser._id,
      type: "unfollow_creator",
      amount: 5,
    });

    return NextResponse.json({ success: true, message: "Unfollowed" });
  } catch (error) {
    logger.error("POST /api/follow/unfollow error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
