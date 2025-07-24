// app/api/example/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privy } from "@/lib/privyClient";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await privy.getUser({ idToken });

    return NextResponse.json({ user });
  } catch (err) {
    logger.error("Privy verification error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
