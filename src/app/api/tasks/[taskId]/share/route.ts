import { getLoggedInUser } from "@/lib/auth/getUser";
import connectDB from "@/lib/connectDB";
import { logger } from "@/lib/logger";
import { TaskShare } from "@/lib/models/TaskShare";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { platform } = body;

    const { taskId } = await context.params;

    if (!platform) {
      return NextResponse.json(
        { message: "Task ID and platform are required" },
        { status: 400 }
      );
    }

    const user = await getLoggedInUser();

    await TaskShare.create({
      taskId,
      platform,
      userId: user.id,
    });

    return NextResponse.json(
      { message: "Task shared successfully" },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error in POST /api/tasks/[taskId]/share:", error);
    return NextResponse.json(
      {
        message: "Failed to share task",
      },
      { status: 500 }
    );
  }
}
