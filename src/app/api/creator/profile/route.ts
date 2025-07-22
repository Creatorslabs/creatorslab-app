// export const runtime = "nodejs";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { Task as ITask } from "@/types/Task";

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

    const dbUser = await User.findOne({ privyId: privyUser.id })
      .select("username email referralCode balance verification image")
      .lean<IUser>();

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const verified =
      dbUser.verification?.discord &&
      dbUser.verification?.twitter &&
      dbUser.verification?.email;

    const inviteLink = `${process.env.NEXTAUTH_URL}/auth/signup/${dbUser.username}`;
    const tasks = await Task.find({ creator: dbUser._id })
      .populate({
        path: "creator",
        select: "username image",
      })
      .lean<ITask[]>();

    const mappedTasks = tasks.map((task) => {
      const isExpired =
        task.expiration && new Date(task.expiration) < new Date();

      const textStatus =
        task.status === "active" && !isExpired ? "Ongoing" : "Finished";

      const creator = {
        username: task.creator?.username || "CreatorsLab",
        image: task.creator?.image || "https://creatorlab.cc/logo.png",
      };

      return {
        ...task,
        creator,
        textStatus,
      };
    });

    const responseData = {
      id: dbUser._id.toString(),
      username: dbUser.username,
      email: dbUser.email,
      avatar: dbUser.image || "https://i.pravatar.cc/100",
      verified,
      balance: dbUser.balance.toFixed(4),
      inviteLink,
      tasks: mappedTasks,
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("GET /api/user/dashboard error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
