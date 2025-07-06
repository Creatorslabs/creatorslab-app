import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ username: string }> }
) {
  await connectDB();

  const { username } = await context.params;

  if (!username) {
    return NextResponse.json({ message: "Username required" }, { status: 400 });
  }

  const existing = await User.findOne({
    username: username.toLowerCase(),
  }).lean();

  return NextResponse.json({ available: !existing });
}
