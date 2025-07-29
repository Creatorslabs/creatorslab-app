import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/connectDB";
import { privy } from "@/lib/privyClient";
import { User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { Participation } from "@/lib/models/Participation";
import { logBalanceTransaction } from "@/lib/helpers/logBalanceTransaction";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });
    if (!privyUser?.id) {
      return NextResponse.json(
        { error: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ privyId: privyUser.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const participation = await Participation.findOne({
      taskId,
      userId: user._id,
    });

    if (!participation) {
      return NextResponse.json(
        { error: "You have not participated in this task" },
        { status: 400 }
      );
    }

    if (participation.status !== "completed") {
      return NextResponse.json(
        { error: "Task must be completed before claiming reward" },
        { status: 400 }
      );
    }

    const rewardPoints = task.rewardPoints;

    user.balance += rewardPoints;
    await user.save();

    await logBalanceTransaction({
      userId: user._id,
      type: "completed_task",
      amount: rewardPoints,
    });

    participation.status = "claimed";
    await participation.save();

    return NextResponse.json({
      success: true,
      message: "Reward claimed successfully",
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("POST /api/claim-task error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
