import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/lib/privyClient";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get("privy-id-token")?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const privyUser = await privy.getUser({ idToken });

    if (!privyUser?.id || !privyUser.wallet?.id) {
      return NextResponse.json(
        { message: "Invalid Privy user" },
        { status: 401 }
      );
    }

    const walletId = privyUser.wallet.id;

    const { cursor, limit = 10 } = await req.json();

    const result = await privy.walletApi.getTransactions({
      walletId,
      chain: "sol",
      asset: ["sol", "usdc"],
      cursor,
      limit,
    });

    const formatted = result.transactions.map((t: any) => ({
      id: t.privy_transaction_id,
      type: t.details.type === "transfer_received" ? "earn" : "spend",
      amount: t.details.display_values[t.details.asset] || t.details.raw_value,
      currency: t.details.asset.toUpperCase(),
      timestamp: new Date(t.created_at),
      description: `${t.details.type.replace(/_/g, " ")}: ${t.details.asset}`,
    }));

    return NextResponse.json({
      transactions: formatted,
      pagination: {
        hasNextPage: !!result.next_cursor,
        hasPreviousPage: !!cursor,
        nextCursor: result.next_cursor ?? null,
        currentCursor: cursor ?? null,
      },
    });
  } catch (err) {
    console.error("[TX_API]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
