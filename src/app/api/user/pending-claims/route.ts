import { NextResponse } from "next/server";
import { Participation } from "@/lib/models/Participation";
import "@/lib/models/Task";
import { logger } from "@/lib/logger";
import { getLoggedInUser } from "@/lib/auth/getUser";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const participations = await Participation.find({
      userId: user._id.toString(),
    })
      .populate("taskId")
      .lean();

    const pendingClaims = participations.map((p: any) => {
      const task = p.taskId;
      return {
        id: task._id.toString(),
        task: task?.title || "Untitled task",
        amount: `CLS ${task?.rewardPoints ? task?.rewardPoints : "0.00"}`,
        platform: task?.platform || "unknown",
        canClaim: p.status === "completed",
        isClaimed: p.status === "claimed",
        status: p.status,
      };
    });

    return NextResponse.json({ success: true, data: pendingClaims });
  } catch (error) {
    logger.error("GET /api/user/pending-claims error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
