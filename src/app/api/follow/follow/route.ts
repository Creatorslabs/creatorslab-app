import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Follow } from "@/lib/models/Follow";

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
        { message: "Cannot follow yourself" },
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

    if (authUser.role !== "creator") {
      return NextResponse.json(
        { message: "Only screators can follow creators" },
        { status: 403 }
      );
    }

    if (existingFollow) {
      return NextResponse.json(
        { message: "Already following" },
        { status: 409 }
      );
    }

    await Follow.create({
      followerId: authUser._id,
      followingId: creatorId,
    });

    return NextResponse.json({ success: true, message: "Followed" });
  } catch (error) {
    console.error("POST /api/follow/follow error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
