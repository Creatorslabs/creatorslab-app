import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { User } from "@/lib/models/User";
import { del } from "@vercel/blob";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { userId, newUrl, oldUrl } = await req.json();

    if (!userId || !newUrl) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete old image if it's from Vercel Blob
    if (oldUrl && oldUrl.includes(".blob.vercel-storage.com")) {
      const { pathname } = new URL(oldUrl);
      await del(pathname.startsWith("/") ? pathname.slice(1) : pathname);
    }

    // Update database
    user.image = newUrl;
    await user.save();

    return NextResponse.json({ message: "Avatar updated", avatar: newUrl });
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
