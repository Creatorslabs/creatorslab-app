import connectDB from "@/lib/connectDB";
import { Engagement } from "@/lib/models/Engagement";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await connectDB();

    const engagements = await Engagement.find().lean();

    const platformSet = new Set(engagements.map((e: any) => e.socialPlatform));
    const socialPlatforms = Array.from(platformSet).map((platform: any) => ({
      value: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }));

    const engagementOptions: Record<string, string[]> = {};

    for (const engagement of engagements) {
      if (!engagementOptions[engagement.socialPlatform]) {
        engagementOptions[engagement.socialPlatform] = [];
      }

      engagementOptions[engagement.socialPlatform].push(
        ...engagement.engagementType
      );
    }

    // Remove duplicates in engagement types
    for (const key in engagementOptions) {
      engagementOptions[key] = [...new Set(engagementOptions[key])];
    }

    return NextResponse.json({
      success: true,
      data: {
        engagementOptions,
        socialPlatforms,
      },
    });
  } catch (error) {
    logger.error("Error fetching engagement options:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch engagement options",
      },
      { status: 500 }
    );
  }
}
