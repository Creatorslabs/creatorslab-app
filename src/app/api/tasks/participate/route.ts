import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";
import { Participation } from "@/lib/models/Participation";
import { Task } from "@/lib/models/Task";
import { User } from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { taskId, proof } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    if (!proof) {
      return NextResponse.json({ error: "Proof is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });
    if (!privyUser?.id) {
      return NextResponse.json(
        { error: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ privyId: privyUser.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (String(task.creator) === String(user._id)) {
      return NextResponse.json(
        { error: "You cannot participate in your own task" },
        { status: 403 }
      );
    }

    if (new Date(task.expiration) < new Date()) {
      return NextResponse.json({ error: "Task has expired" }, { status: 400 });
    }

    const participantCount = await Participation.countDocuments({ taskId });
    if (participantCount >= task.maxParticipants) {
      return NextResponse.json(
        { error: "Maximum participants reached" },
        { status: 400 }
      );
    }

    const alreadyParticipated = await Participation.findOne({
      taskId,
      userId: user._id,
    });

    if (alreadyParticipated) {
      return NextResponse.json(
        { error: "Already participated" },
        { status: 400 }
      );
    }

    const newParticipation = new Participation({
      userId: user._id,
      taskId,
      proof: proof,
    });

    await newParticipation.save();

    return NextResponse.json(
      { message: "Participation successful" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error processing participation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
