import { NextRequest, NextResponse } from "next/server";
import { TaskLike } from "@/lib/models/TaskLike";
import connectDB from "@/lib/connectDB";
import { getLoggedInUser } from "@/lib/auth/getUser";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const user = await getLoggedInUser();
    const { taskId } = await context.params;

    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ message: "Invalid Task ID" }, { status: 400 });
    }

    const liked = await TaskLike.exists({ taskId, userId: user._id });

    return NextResponse.json({ liked: !!liked });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
