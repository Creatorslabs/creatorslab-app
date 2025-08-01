import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Task } from "@/lib/models/Task";
import { logBalanceTransaction } from "@/lib/helpers/logBalanceTransaction";
import { logger } from "@/lib/logger";
import { getLoggedInUser } from "@/lib/auth/getUser";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const localUser = await getLoggedInUser();

    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (localUser.role !== "creator") {
      return NextResponse.json(
        { message: "Forbidden. Not a creator." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      platform,
      type,
      description,
      target,
      rewardPoints,
      maxParticipants,
      expiration,
      category,
      image,
    } = body;

    if (
      !title ||
      !platform ||
      !Array.isArray(type) ||
      type.length === 0 ||
      !target ||
      !rewardPoints ||
      !maxParticipants ||
      !category
    ) {
      return NextResponse.json(
        { message: "Missing or invalid task fields" },
        { status: 400 }
      );
    }

    const total = rewardPoints * maxParticipants;

    if (expiration && new Date(expiration) < new Date()) {
      return NextResponse.json(
        { message: "Expiration date cannot be in the past" },
        { status: 400 }
      );
    }

    if (localUser.balance < total) {
      return NextResponse.json(
        { message: "Not enough balance to create this task." },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title,
      platform,
      type,
      description,
      target,
      rewardPoints,
      category,
      maxParticipants,
      expiration: expiration || null,
      image,
      creator: localUser._id,
    });

    User.findByIdAndUpdate(localUser._id, {
      $inc: { balance: -total },
    });

    await logBalanceTransaction({
      userId: localUser._id,
      type: "create_task",
      amount: rewardPoints * maxParticipants,
    });

    return NextResponse.json(
      { message: "Task created", data: task },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Task creation error:", error);
    console.error("Task creation error:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
