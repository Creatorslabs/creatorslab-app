import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { logBalanceTransaction } from "@/lib/helpers/logBalanceTransaction";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });

    if (!privyUser?.id) {
      return NextResponse.json(
        { message: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const localUser = await User.findOne({ privyId: privyUser.id });

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

    if (expiration && new Date(expiration) < new Date()) {
      return NextResponse.json(
        { message: "Expiration date cannot be in the past" },
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
    console.error("Task creation error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
