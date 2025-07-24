import { PrivyClient } from "@privy-io/server-auth";
import { logger } from "@/lib/logger";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const appSecret = process.env.PRIVY_SECRET;

// logger.log("Privy App ID:", appId);
// logger.log("Privy App Secret:", appSecret ? "exists" : "MISSING");

if (!appId || !appSecret) {
  // logger.error("Missing PRIVY App ID or App Secret");
  throw new Error("PrivyClient init failed: ENV missing");
}

// logger.log("Privy initialized with app ID:", appId);

export const privy = new PrivyClient(appId, appSecret);
