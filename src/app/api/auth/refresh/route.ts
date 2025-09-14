import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token" },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("privy-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to refresh" },
      { status: 500 }
    );
  }
}
