import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Follow } from "@/lib/models/Follow";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";

interface Params {
  params: Promise<{
    creatorUsername: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    await connectDB();

    const { creatorUsername } = await params;

    const dbUser = await User.findOne({
      username: creatorUsername,
    }).lean<IUser>();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "Creator not found" },
        { status: 404 }
      );
    }

    if (dbUser.role !== "creator") {
      return NextResponse.json(
        {
          sucesss: false,
          message: "User is not a creator",
        },
        { status: 403 }
      );
    }

    const privyUser = await privy.getUserByEmail(dbUser.email!);

    if (!privyUser) {
      return NextResponse.json(
        { success: false, message: "Creator doesn't seem to be registerd" },
        { status: 404 }
      );
    }

    const followers = await Follow.find({ followingId: dbUser._id })
      .select("followerId -_id")
      .lean();

    const isVerified =
      dbUser.verification?.discord &&
      dbUser.verification?.twitter &&
      dbUser.verification?.email;

    return NextResponse.json({
      success: true,
      data: {
        id: dbUser._id,
        username: dbUser.username,
        image: dbUser.image || "https://i.pravatar.cc/100",
        isVerified: Boolean(isVerified),
        twitter: privyUser.twitter?.username,
        discord: privyUser.discord?.username?.replace(/#\d+$/, ""),
        followers,
      },
    });
  } catch (error) {
    console.error("GET /api/creators/:creatorUsername error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
