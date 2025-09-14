import { NextResponse } from "next/server";
import { Task } from "@/lib/models/Task";
import { Task as ITask } from "@/types/Task";
import { logger } from "@/lib/logger";
import { getLoggedInUser } from "@/lib/auth/getUser";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tasks = await Task.find({ creator: user._id })
      .sort({ createdAt: -1 })
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

    return NextResponse.json({ success: true, data: mappedTasks });
  } catch (error) {
    logger.error("GET /api/user/tasks error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
