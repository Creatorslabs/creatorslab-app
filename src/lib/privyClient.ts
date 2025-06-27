import { PrivyClient } from "@privy-io/server-auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const appSecret = process.env.PRIVY_SECRET!;

if (!appId || !appSecret) {
  throw new Error("Missing PRIVY_APP_ID or PRIVY_APP_SECRET in environment variables");
}

export const privy = new PrivyClient(appId, appSecret);
