import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Follow } from "@/lib/models/Follow";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: creatorId } = await context.params;

    if (!creatorId) {
      return NextResponse.json(
        { success: false, message: "Missing creator ID" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });
    if (!privyUser?.id) {
      return NextResponse.json(
        { success: false, message: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const localUser = await User.findOne({
      privyId: privyUser.id,
    }).lean<IUser>();
    if (!localUser) {
      return NextResponse.json(
        { success: false, message: "Local user not found" },
        { status: 404 }
      );
    }

    const followExists = await Follow.exists({
      followerId: localUser._id,
      followingId: creatorId,
    });

    return NextResponse.json({
      success: true,
      isFollowing: !!followExists,
    });
  } catch (error) {
    console.error("GET /api/follow/status/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
