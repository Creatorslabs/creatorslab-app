import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { Participation } from "@/lib/models/Participation";
import { Follow } from "@/lib/models/Follow";

const fallbackCreators = [
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
];

export async function GET() {
  try {
    await connectDB();

    const topByFollowersAgg = await Follow.aggregate([
      {
        $group: {
          _id: "$followingId",
          followerCount: { $sum: 1 },
        },
      },
      { $sort: { followerCount: -1 } },
      { $limit: 10 },
    ]);

    const topFollowerUserIds = topByFollowersAgg.map((f) => f._id);

    const topByFollowers = await User.find({ _id: { $in: topFollowerUserIds } })
      .select("image")
      .lean();

    const taskStats = await Task.aggregate([
      {
        $lookup: {
          from: "participations",
          localField: "_id",
          foreignField: "taskId",
          as: "participants",
        },
      },
      {
        $group: {
          _id: "$creator",
          totalParticipants: { $sum: { $size: "$participants" } },
        },
      },
      { $sort: { totalParticipants: -1 } },
      { $limit: 10 },
    ]);

    const topByParticipationIds = taskStats.map((t) => t._id);

    const topByParticipation = await User.find({
      _id: { $in: topByParticipationIds },
    })
      .select("image")
      .lean();

    const allImages = [
      ...topByFollowers.map((u) => u.image),
      ...topByParticipation.map((u) => u.image),
    ].filter(Boolean);

    const uniqueImages = Array.from(new Set(allImages));

    while (uniqueImages.length < 7) {
      const fallback = fallbackCreators[uniqueImages.length];
      uniqueImages.push(fallback);
    }

    return NextResponse.json({
      success: true,
      creators: uniqueImages.slice(0, 7),
    });
  } catch (err) {
    console.error("Error in GET /api/creators/top:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
