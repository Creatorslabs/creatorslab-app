import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { IUser, User } from "@/lib/models/User";
import { privy } from "@/lib/privyClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getRandomCount(base: number = 1000): string {
  const num = base + Math.random() * base;

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return Math.floor(num).toString();
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      console.warn("No Privy ID Token found in cookies");
    }

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
            console.warn("⚠️ No local user found for privyId:", privyUser.id);
          }
        }
      } catch (err) {
        console.error("❌ Privy token error:", err);
      }
    }

    // Get user participations
    const userParticipations = localUserId
      ? await Participation.find({ userId: localUserId })
          .select("taskId")
          .lean()
      : [];

    const participatedTaskIds = new Set(
      userParticipations.map((p) => p.taskId.toString())
    );

    // NEWEST TASKS (filter user participated if logged in)
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

    // TRENDING: Aggregate by participation count
    const trendingAgg = await Participation.aggregate([
      { $group: { _id: "$taskId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const trendingTaskIds = trendingAgg.map((item: any) => item._id);
    let trendingTasks = await Task.find({
      _id: { $in: trendingTaskIds },
      status: "active",
    })
      .populate("creator", "image")
      .lean();

    // If there are no participations, fall back to latest tasks
    if (trendingTasks.length === 0) {
      trendingTasks = await Task.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("creator", "image")
        .lean();
    }

    // Format response
    const formatTask = (task: any) => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      image: task.image,
      reward: `${task.rewardPoints} $CLS`,
      likes: getRandomCount(1000),
      comments: getRandomCount(5000),
      shares: getRandomCount(100),
      avatar: task.creator?.image || "",
    });

    return NextResponse.json({
      success: true,
      data: {
        newestTask: newestTasks.map(formatTask),
        trendingTask: trendingTasks.map(formatTask),
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
    console.error("GET /api/explore error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
