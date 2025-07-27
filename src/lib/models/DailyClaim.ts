import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDailyClaim extends Document {
  userId: Types.ObjectId;
  lastClaimedAt: Date | null;
  streak: number;
}

const DailyClaimSchema = new Schema<IDailyClaim>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    lastClaimedAt: {
      type: Date,
      default: null,
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DailyClaim =
  mongoose.models.DailyClaim ||
  mongoose.model<IDailyClaim>("DailyClaim", DailyClaimSchema);

export default DailyClaim;
