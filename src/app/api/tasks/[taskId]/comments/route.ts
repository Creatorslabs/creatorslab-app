import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { TaskComment } from "@/lib/models/TaskComment";
import { getLoggedInUser } from "@/lib/auth/getUser";

export async function GET(
  _: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const { taskId } = await context.params;
    const comments = await TaskComment.find({ taskId: taskId })
      .sort({ createdAt: -1 })
      .populate("userId", "username image")
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { message } = body;

    const { taskId } = await context.params;

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const comment = await TaskComment.create({
      taskId: taskId,
      userId: user._id,
      message,
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to post comment" },
      { status: 500 }
    );
  }
}
