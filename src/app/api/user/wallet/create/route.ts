import { NextResponse } from "react";
import { cookies } from "next/headers";
import { onCreateWallet } from "@/lib/privy/onCreateWallet";

export async function POST() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("privy-id-token")?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await onCreateWallet(idToken);
    return Response.json(result);
  } catch (err) {
    console.error("Wallet creation failed:", err);
    return Response.json(
      { message: "Wallet creation failed" },
      { status: 500 }
    );
  }
}
