import connectDB from "@/lib/connectDB";
import { logger } from "@/lib/logger";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { ITask } from "@/types/Task";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  await connectDB();

  const { taskId } = await context.params;

  try {
    const task = await Task.findById(taskId)
      .populate("creator", "username image")
      .lean<ITask>();

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const currentParticipants = await Participation.countDocuments({
      task: task._id,
    });

    return NextResponse.json({
      creator: {
        username: task.creator?.username || "Anonymous",
        image: task.creator?.image || "https://i.pravatar.cc/100",
      },
      title: task.title,
      target: task.target,
      description: task.description,
      type: task.type,
      expiration: task.expiration,
      createdAt: task.createdAt,
      maxParticipants: task.maxParticipants,
      currentParticipants,
    });
  } catch (error) {
    logger.error("[TASK_OVERVIEW_ERROR]", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
