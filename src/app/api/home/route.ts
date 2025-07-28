import connectDB from "@/lib/connectDB";
import { logger } from "@/lib/logger";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { TaskLike } from "@/lib/models/TaskLike";
import { TaskComment } from "@/lib/models/TaskComment";
import { TaskShare } from "@/lib/models/TaskShare";
import { IUser, User } from "@/lib/models/User";
import { privy } from "@/lib/privyClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { calculateTrendingScore } from "@/lib/helpers/calculateTrendingScore";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    let localUserId: string | null = null;

    if (idToken) {
      try {
        const privyUser = await privy.getUser({ idToken });

        if (privyUser) {
          const localUser = await User.findOne({ privyId: privyUser.id })
            .select("_id username email")
            .lean<IUser>();

          if (localUser) {
            localUserId = localUser._id.toString();
          } else {
            logger.warn("No local user found for privyId:", privyUser.id);
          }
        }
      } catch (err) {
        logger.error("Privy token error:", err);
      }
    }

    const userParticipations = localUserId
      ? await Participation.find({ userId: localUserId })
          .select("taskId")
          .lean()
      : [];

    const participatedTaskIds = new Set(
      userParticipations.map((p) => p.taskId.toString())
    );

    const newestQuery: any = { status: "active" };
    if (localUserId) {
      newestQuery._id = { $nin: Array.from(participatedTaskIds) };
    }

    const [newestTasks, totalTasks] = await Promise.all([
      Task.find(newestQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("creator", "image")
        .lean(),
      Task.countDocuments(newestQuery),
    ]);

    const trendingAgg = await Participation.aggregate([
      { $group: { _id: "$taskId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const trendingTaskIds = trendingAgg.map((item) => item._id);
    let trendingTasks = await Task.find({
      _id: { $in: trendingTaskIds },
      status: "active",
    })
      .populate("creator", "image")
      .lean();

    if (trendingTasks.length === 0) {
      trendingTasks = await Task.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("creator", "image")
        .lean();
    }

    const allTasks = [...newestTasks, ...trendingTasks];
    const taskIds = allTasks.map((t) => t._id);

    const [likeCounts, commentCounts, shareCounts] = await Promise.all([
      TaskLike.aggregate([
        { $match: { taskId: { $in: taskIds } } },
        { $group: { _id: "$taskId", count: { $sum: 1 } } },
      ]),
      TaskComment.aggregate([
        { $match: { taskId: { $in: taskIds } } },
        { $group: { _id: "$taskId", count: { $sum: 1 } } },
      ]),
      TaskShare.aggregate([
        { $match: { taskId: { $in: taskIds } } },
        { $group: { _id: "$taskId", count: { $sum: 1 } } },
      ]),
    ]);

    const likesMap = Object.fromEntries(
      likeCounts.map((c) => [c._id.toString(), c.count])
    );
    const commentsMap = Object.fromEntries(
      commentCounts.map((c) => [c._id.toString(), c.count])
    );
    const sharesMap = Object.fromEntries(
      shareCounts.map((c) => [c._id.toString(), c.count])
    );

    const formatCount = (count: number): string => {
      if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
      if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
      return count.toString();
    };

    const formatTask = (task: any) => {
      const idStr = task._id.toString();
      return {
        id: idStr,
        title: task.title,
        description: task.description,
        image: task.image,
        reward: `${task.rewardPoints} $CLS`,
        likes: formatCount(likesMap[idStr] || 0),
        comments: formatCount(commentsMap[idStr] || 0),
        shares: formatCount(sharesMap[idStr] || 0),
        avatar: task.creator?.image || "",
      };
    };

    const sortByTrendingScore = (a: any, b: any) =>
      calculateTrendingScore(b) - calculateTrendingScore(a);

    return NextResponse.json({
      success: true,
      data: {
        newestTask: newestTasks.map(formatTask),
        trendingTask: trendingTasks.map(formatTask).sort(sortByTrendingScore),
      },
      pagination: {
        page,
        limit,
        total: totalTasks,
        pages: Math.ceil(totalTasks / limit),
        hasNext: page < Math.ceil(totalTasks / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error("GET /api/explore error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
