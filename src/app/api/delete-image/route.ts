// app/api/delete-image/route.ts
import { logger } from "@/lib/logger";
import { del, list } from "@vercel/blob";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return new Response("Invalid URL", { status: 400 });
  }

  try {
    const { pathname } = new URL(url);
    const blobPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

    // logger.log("Attempting to delete:", blobPath);

    const blobs = await list({ prefix: "tasks/" });
    const allPaths = blobs.blobs.map((b) => b.pathname);
    // logger.log("All blobs in store:", allPaths);
    // logger.log("Path exists in list:", allPaths.includes(blobPath));

    await del(blobPath);
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    logger.error("Blob deletion error:", err);
    return new Response("Failed to delete", { status: 500 });
  }
}
