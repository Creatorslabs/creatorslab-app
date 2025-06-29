import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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

    const skip = (page - 1) * limit;

    const match: any = { status: "active" };
    if (platform && platform !== "all") match.platform = platform;
    if (type) match.type = type;

    const pipeline: any[] = [];

    // Fuzzy search with Atlas Search
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
    }

    // Add filters
    pipeline.push({ $match: match });

    // Optional: add score for relevance sorting
    if (rawSearch) {
      pipeline.push({
        $addFields: {
          score: { $meta: "searchScore" },
        },
      });
    }

    // Join creator data
    pipeline.push({
      $lookup: {
        from: "users", // must match actual Mongo collection name
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

    // Sorting
    const sortField =
      sort === "oldest" ? { createdAt: 1 } :
      sort === "trending" ? {} : // handle trending later
      rawSearch ? { score: -1, createdAt: -1 } :
      { createdAt: -1 };

    if (Object.keys(sortField).length > 0) {
      pipeline.push({ $sort: sortField });
    }

    // Paginate
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Run aggregation
    const allTasks = await Task.aggregate(pipeline);

    // Participation stats
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

    const formatCount = (count: number): string => {
      if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
      if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
      return count.toString();
    };

    const resultTasks = allTasks.map((task) => ({
      id: (task._id as mongoose.Types.ObjectId).toString(),
      title: task.title,
      description: task.description,
      image: task.image,
      reward: `${task.rewardPoints} $CLS`,
      likes: formatCount(Math.floor(Math.random() * 3000 + 50)),
      comments: formatCount(Math.floor(Math.random() * 1000 + 10)),
      shares: formatCount(Math.floor(Math.random() * 500 + 5)),
      gradient: "from-blue-600 to-purple-600",
      avatar: task.creator?.image || "",
      createdAt: task.createdAt || new Date(),
      participationCount:
        participationCountMap[(task._id as string).toString()] || 0,
    }));

    // Optional: Trending sort by participation count
    if (sort === "trending") {
      resultTasks.sort(
        (a, b) => (b.participationCount ?? 0) - (a.participationCount ?? 0)
      );
    }

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
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
