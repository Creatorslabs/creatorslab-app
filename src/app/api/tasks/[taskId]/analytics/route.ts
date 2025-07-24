import connectDB from "@/lib/connectDB";
import { logger } from "@/lib/logger";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  await connectDB();

  const { taskId } = await context.params;

  try {
    const [task, participations] = await Promise.all([
      Task.findById(taskId),
      Participation.find({ task: taskId }),
    ]);

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const totalParticipants = participations.length;

    const participationRate = task.maxParticipants
      ? Math.round((totalParticipants / task.maxParticipants) * 100)
      : 0;

    const completedCount = participations.filter(
      (p) => p.status === "completed"
    ).length;

    const successRate =
      totalParticipants > 0
        ? Math.round((completedCount / totalParticipants) * 100)
        : 0;

    const totalTime = participations.reduce((sum, p) => {
      if (p.createdAt && p.updatedAt) {
        const diff =
          new Date(p.updatedAt).getTime() - new Date(p.createdAt).getTime();
        return sum + diff;
      }
      return sum;
    }, 0);

    const avgMs = totalParticipants > 0 ? totalTime / totalParticipants : 0;
    const avgMinutes = Math.round(avgMs / (1000 * 60));
    const averageCompletionTime =
      avgMinutes > 0
        ? `${avgMinutes} minute${avgMinutes !== 1 ? "s" : ""}`
        : "Less than a minute";

    const totalDistributed = task.rewardPoints * totalParticipants;

    return NextResponse.json({
      totalParticipants,
      participationRate,
      successRate,
      averageCompletionTime,
      totalDistributed,
    });
  } catch (error) {
    logger.error("Analytics Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
