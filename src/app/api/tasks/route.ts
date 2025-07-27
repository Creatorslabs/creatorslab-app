import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import { TaskLike } from "@/lib/models/TaskLike";
import { TaskComment } from "@/lib/models/TaskComment";
import { TaskShare } from "@/lib/models/TaskShare";
import { calculateTrendingScore } from "@/lib/helpers/calculateTrendingScore";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const sort = searchParams.get("sort") || "newest";
    const platform = searchParams.get("platform");
    const type = searchParams.get("type");
    const rawSearch = searchParams.get("search")?.trim();
    const creatorId = searchParams.get("creatorId");

    const skip = (page - 1) * limit;

    const match: any = { status: "active" };
    if (platform && platform !== "all") match.platform = platform;
    if (type) match.type = type;

    if (creatorId && mongoose.Types.ObjectId.isValid(creatorId)) {
      match.creator = {
        $in: [new mongoose.Types.ObjectId(creatorId), creatorId],
      };
    }

    const pipeline: any[] = [];

    if (rawSearch && rawSearch.length > 0) {
      pipeline.push({
        $search: {
          index: "creatorlab_task",
          compound: {
            should: [
              {
                autocomplete: {
                  query: rawSearch,
                  path: "title",
                  fuzzy: { maxEdits: 2 },
                },
              },
              {
                autocomplete: {
                  query: rawSearch,
                  path: "description",
                  fuzzy: { maxEdits: 2 },
                },
              },
            ],
          },
        },
      });

      pipeline.push({ $addFields: { score: { $meta: "searchScore" } } });
    }

    pipeline.push({ $match: match });

    if (rawSearch) {
      pipeline.push({
        $addFields: {
          score: { $meta: "searchScore" },
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$creator",
        preserveNullAndEmptyArrays: true,
      },
    });

    const sortField =
      sort === "oldest"
        ? { createdAt: 1 }
        : sort === "trending"
        ? {}
        : rawSearch
        ? { score: -1, createdAt: -1 }
        : { createdAt: -1 };

    if (Object.keys(sortField).length > 0) {
      pipeline.push({ $sort: sortField });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // logger.log("AGGREGATE PIPELINE:", JSON.stringify(pipeline, null, 2));

    const allTasks = await Task.aggregate(pipeline);

    // logger.log("All tasks:", allTasks);

    const participations = await Participation.find({
      taskId: { $in: allTasks.map((t) => t._id) },
    }).lean();

    const participationCountMap = participations.reduce<Record<string, number>>(
      (acc, p) => {
        const key = p.taskId.toString();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

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

    const now = new Date();

    const tasksWithExtra = allTasks.map((task) => {
      const idStr = task._id.toString();
      const expirationDate = task.expiration ? new Date(task.expiration) : null;
      const isExpired = expirationDate ? expirationDate <= now : false;

      return {
        id: (task._id as mongoose.Types.ObjectId).toString(),
        title: task.title,
        description: task.description,
        image: task.image,
        reward: `${task.rewardPoints} $CLS`,
        likes: formatCount(likesMap[idStr] || 0),
        comments: formatCount(commentsMap[idStr] || 0),
        shares: formatCount(sharesMap[idStr] || 0),
        gradient: "from-blue-600 to-purple-600",
        avatar: task.creator?.image || "",
        createdAt: task.createdAt || new Date(),
        participationCount:
          participationCountMap[(task._id as string).toString()] || 0,
        expiration: task.expiration,
        isExpired,
      };
    });

    let activeTasks = tasksWithExtra.filter((task) => !task.isExpired);
    let expiredTasks = tasksWithExtra.filter((task) => task.isExpired);

    if (sort === "trending") {
      const sortByTrendingScore = (a: any, b: any) =>
        calculateTrendingScore(b) - calculateTrendingScore(a);

      activeTasks.sort(sortByTrendingScore);
      expiredTasks.sort(sortByTrendingScore);
    } else if (sort === "oldest") {
      activeTasks.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      expiredTasks.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else {
      activeTasks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      expiredTasks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const resultTasks = [...activeTasks, ...expiredTasks];

    return NextResponse.json({
      success: true,
      data: resultTasks,
      pagination: {
        page,
        limit,
        total: resultTasks.length,
        pages: Math.ceil(resultTasks.length / limit),
        hasNext: resultTasks.length === limit,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
