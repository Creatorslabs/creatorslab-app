// app/api/delete-image/route.ts
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

    // console.log("Attempting to delete:", blobPath);

    const blobs = await list({ prefix: "tasks/" });
    const allPaths = blobs.blobs.map((b) => b.pathname);
    // console.log("All blobs in store:", allPaths);
    // console.log("Path exists in list:", allPaths.includes(blobPath));

    await del(blobPath);
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error("Blob deletion error:", err);
    return new Response("Failed to delete", { status: 500 });
  }
}
