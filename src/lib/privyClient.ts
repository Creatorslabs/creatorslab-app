import { PrivyClient } from "@privy-io/server-auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const appSecret = process.env.PRIVY_SECRET;

// console.log("Privy App ID:", appId);
// console.log("Privy App Secret:", appSecret ? "exists" : "MISSING");

if (!appId || !appSecret) {
  // console.error("❌ Missing PRIVY App ID or App Secret");
  throw new Error("PrivyClient init failed: ENV missing");
}

// console.log("✅ Privy initialized with app ID:", appId);

export const privy = new PrivyClient(appId, appSecret);
