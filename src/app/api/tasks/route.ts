import connectDB from "@/lib/connectDB";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const sort = searchParams.get("sort") || "newest";
    const platform = searchParams.get("platform");
    const type = searchParams.get("type");

    const query: any = { status: "active" };

    if (platform && platform !== "all") query.platform = platform;

    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const allTasks = await Task.find(query).populate("creator", "image").lean();

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

    let sortedTasks = allTasks.map((task) => ({
      id: (task._id as string).toString(),
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

    if (sort === "oldest") {
      sortedTasks.sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
      );
    } else if (sort === "trending") {
      sortedTasks.sort(
        (a, b) => (b.participationCount ?? 0) - (a.participationCount ?? 0)
      );
    } else {
      sortedTasks.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
    }

    const paginated = sortedTasks.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total: sortedTasks.length,
        pages: Math.ceil(sortedTasks.length / limit),
        hasNext: page < Math.ceil(sortedTasks.length / limit),
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
