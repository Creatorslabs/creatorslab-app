import connectDB from "@/lib/connectDB";
import Log from "@/lib/models/Log";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const log = await Log.create({
      level: body.level,
      message: body.message,
      meta: body.meta || {},
      environment: process.env.NODE_ENV,
      isClient: body.isClient || false,
    });

    return NextResponse.json({ success: true, id: log._id });
  } catch (error) {
    console.error("Error saving log:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
