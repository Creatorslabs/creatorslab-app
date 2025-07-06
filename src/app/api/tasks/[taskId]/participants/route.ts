import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";
import { ITask, Task } from "@/lib/models/Task";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  await connectDB();

  const { taskId } = await context.params;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");

  const task = await Task.findById(taskId).lean<ITask>();

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const [totalParticipants, participants] = await Promise.all([
    Participation.countDocuments({ task: taskId }),
    Participation.find({ task: taskId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("userId", "username image"),
  ]);

  return NextResponse.json({
    data: participants.map((p) => ({
      id: p._id,
      status: p.status,
      joinedAt: p.createdAt,
      user: {
        username: p.userId?.username || "Unknown",
        image: p.userId?.image || "https://i.pravatar.cc/100",
      },
    })),
    currentParticipants: totalParticipants,
    maxParticipants: task.maxParticipants,
    totalPages: Math.ceil(totalParticipants / pageSize),
    currentPage: page,
  });
}
