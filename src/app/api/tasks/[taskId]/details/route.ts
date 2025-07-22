import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { IUser, User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { IParticipation, Participation } from "@/lib/models/Participation";
import { getTimeRemaining } from "@/lib/helpers/date-helpers";
import { getTaskRequirements } from "@/lib/helpers/task-requirement";

interface Task {
  _id: string;
  title: string;
  description: string;
  image: string;
  rewardPoints: string;
  platform: string;
  type: string[];
  creator: {
    _id: string;
    username: string;
    image: string;
  };
  expiration: Date;
  participants: number;
  maxParticipants: number;
  target: string;
  otherTasks: any[];
  status?: string;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();

    const { taskId } = await context.params;

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;
    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });
    if (!privyUser?.id) {
      return NextResponse.json({ message: "Invalid user" }, { status: 401 });
    }

    const user = await User.findOne({ privyId: privyUser.id }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const task = await Task.findById(taskId)
      .populate("creator", "username image")
      .lean<Task>();

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const creatorId = task.creator._id;

    const [participants, userParticipation] = await Promise.all([
      Participation.countDocuments({ taskId }),
      Participation.findOne({
        taskId,
        userId: user._id,
      }).lean<IParticipation>(),
    ]);

    const participatedTaskIds = await Participation.find({
      userId: user._id,
    }).distinct("taskId");

    const otherTasksRaw = await Task.find({
      creator: creatorId,
      _id: {
        $ne: task._id,
        $nin: participatedTaskIds,
      },
    })
      .select("_id title rewardPoints platform")
      .limit(8);

    const status = userParticipation?.status || null;

    const requirements = getTaskRequirements(
      task.type,
      task.platform,
      task.creator.username
    );

    const otherTasks = otherTasksRaw.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      reward: t.rewardPoints,
      platform: t.platform,
    }));

    // Compute eligibility
    let canParticipate = true;
    let reason = "";

    const now = new Date();

    const hasTwitter = privyUser.linkedAccounts?.some(
      (acc: any) => acc.type === "oauth" && acc.provider === "twitter"
    );

    const hasDiscord = privyUser.linkedAccounts?.some(
      (acc: any) => acc.type === "oauth" && acc.provider === "discord"
    );

    if (String(user._id) === String(creatorId)) {
      canParticipate = false;
      reason = "You cannot participate in your own task.";
    } else if (!hasTwitter && !hasDiscord) {
      canParticipate = false;
      reason =
        "You must link your Twitter or Discord account on Privy to participate.";
    } else if (!hasTwitter) {
      canParticipate = false;
      reason = "You must link your Twitter account on Privy to participate.";
    } else if (!hasDiscord) {
      canParticipate = false;
      reason = "You must link your Discord account on Privy to participate.";
    } else if (task.expiration && new Date(task.expiration) < now) {
      canParticipate = false;
      reason = "This task has expired.";
    } else if (
      typeof task.maxParticipants === "number" &&
      participants >= task.maxParticipants
    ) {
      canParticipate = false;
      reason = "Maximum number of participants reached.";
    } else if (userParticipation) {
      canParticipate = false;
      reason = "You have already participated in this task.";
    }

    const response = {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      image: task.image,
      reward: task.rewardPoints,
      platform: task.platform,
      type: task.type,
      creator: {
        id: creatorId.toString(),
        username: task.creator.username,
        image: task.creator.image,
      },
      timeRemaining: getTimeRemaining(task?.expiration),
      participants,
      maxParticipants: task.maxParticipants,
      target: task.target,
      status,
      proof: userParticipation?.proof || null,
      otherTasks,
      requirements,
      canParticipate,
      reason: canParticipate ? null : reason,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (err) {
    console.error("GET /api/task/[taskId] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
