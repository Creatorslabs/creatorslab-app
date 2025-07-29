import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/connectDB";
import { Task } from "@/lib/models/Task";
import { IUser, User } from "@/lib/models/User";
import { TaskLike } from "@/lib/models/TaskLike";
import { TaskComment } from "@/lib/models/TaskComment";
import { TaskShare } from "@/lib/models/TaskShare";
import { Participation } from "@/lib/models/Participation";
import { privy } from "@/lib/privyClient";
import { calculateTrendingScore } from "@/lib/helpers/calculateTrendingScore";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;
    let localUserId: string | null = null;
    let participatedIds: string[] = [];

    if (idToken) {
      try {
        const privyUser = await privy.getUser({ idToken });
        const localUser = await User.findOne({ privyId: privyUser.id })
          .select("_id")
          .lean<IUser>();
        if (localUser) {
          localUserId = localUser._id.toString();

          participatedIds = await Participation.find({
            userId: localUserId,
          }).distinct("taskId");
        }
      } catch (err) {
        logger.error("Privy token error:", err);
      }
    }

    const now = new Date();
    const baseQuery = {
      status: "active",
      $or: [
        { expiration: { $exists: false } },
        { expiration: null },
        { expiration: { $gt: now } },
      ],
    };

    const excludeQuery = localUserId
      ? { ...baseQuery, _id: { $nin: participatedIds } }
      : baseQuery;

    const activeTasks = await Task.find(excludeQuery)
      .sort({ createdAt: -1 })
      .populate("creator", "image")
      .lean();

    const taskIds = activeTasks.map((task) => task._id);

    const [likes, comments, shares, participations] = await Promise.all([
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
      Participation.aggregate([
        { $match: { taskId: { $in: taskIds } } },
        { $group: { _id: "$taskId", count: { $sum: 1 } } },
      ]),
    ]);

    const toMap = (arr: any[]) =>
      Object.fromEntries(arr.map((item) => [item._id.toString(), item.count]));

    const likesMap = toMap(likes);
    const commentsMap = toMap(comments);
    const sharesMap = toMap(shares);
    const participationsMap = toMap(participations);

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
        participations: participationsMap[idStr] || 0,
        createdAt: task.createdAt,
        avatar: task.creator?.image || "",
      };
    };

    const sortByTrendingScore = (a: any, b: any) =>
      calculateTrendingScore(b) - calculateTrendingScore(a);

    const formattedTrendingTasks = activeTasks
      .map(formatTask)
      .sort(sortByTrendingScore)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      data: {
        trendingTask: formattedTrendingTasks,
        newestTask: activeTasks.slice(0, 6).map(formatTask),
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
