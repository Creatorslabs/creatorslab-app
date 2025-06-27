import { Schema, model, models, Document } from "mongoose";

export interface IEngagement extends Document {
  name: string;
  socialPlatform: string;
  engagementType: string[];
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const EngagementSchema = new Schema<IEngagement>(
  {
    name: { type: String, required: true },
    socialPlatform: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    engagementType: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// ✅ Add a unique index with case-insensitive collation on socialPlatform
EngagementSchema.index(
  { socialPlatform: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 }, // case-insensitive
  }
);

export const Engagement =
  models.Engagement || model<IEngagement>("Engagement", EngagementSchema);
