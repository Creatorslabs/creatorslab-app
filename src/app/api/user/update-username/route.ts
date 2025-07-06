import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const { userId, username } = await req.json();

  if (!userId || !username) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const existing = await User.findOne({ username: username.toLowerCase() });

  if (existing) {
    return NextResponse.json(
      { message: "Username already taken" },
      { status: 409 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  user.username = username.toLowerCase();
  await user.save();

  return NextResponse.json({ message: "Username updated" });
}
