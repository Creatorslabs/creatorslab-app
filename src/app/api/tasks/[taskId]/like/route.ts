import { NextRequest, NextResponse } from "next/server";
import { TaskLike } from "@/lib/models/TaskLike";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import { getLoggedInUser } from "@/lib/auth/getUser";

export async function POST(
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

    await TaskLike.updateOne(
      { taskId, userId: user._id },
      { $setOnInsert: { taskId, userId: user._id } },
      { upsert: true }
    );

    const totalLikes = await TaskLike.countDocuments({ taskId });

    return NextResponse.json({ liked: true, totalLikes });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const user = await getLoggedInUser();
    const { taskId } = await context.params;

    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await TaskLike.deleteOne({ taskId, userId: user._id });
    const totalLikes = await TaskLike.countDocuments({ taskId });

    return NextResponse.json({ liked: false, totalLikes });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
