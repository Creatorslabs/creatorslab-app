import { Schema, model, models, Document } from "mongoose";

export interface IFollow extends Document {
  followerId: string;
  followingId: string;
  createdAt?: Date;
}

const FollowSchema = new Schema<IFollow>(
  {
    followerId: { type: String, ref: "User", required: true },
    followingId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const Follow = models.Follow || model<IFollow>("Follow", FollowSchema);
