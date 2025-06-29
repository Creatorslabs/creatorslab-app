import mongoose, { Schema, model, models, Document } from "mongoose";
import { generateReferralCode } from "../helpers/generate-referal-code";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  image?: string;
  username?: string;
  email?: string;
  privyId: {
    type: string;
    unique: true;
    required: true;
  };
  wallet?: string;
  status: "Active" | "Deactivated";
  reason?: string;
  role: "user" | "creator";
  referralCode?: string;
  referredBy?: string | null;
  referralCount: number;
  balance: number;
  lastLoginDate: Date | null;
  verification: {
    twitter: boolean;
    discord: boolean;
    email: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    image: { type: String },
    username: {
      type: String,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      unique: true,
      sparse: true,
    },
    email: { type: String, default: null },
    privyId: {
      type: String,
      unique: true,
      required: true,
    },
    wallet: { type: String, default: null },
    reason: { type: String, default: null },
    status: {
      type: String,
      enum: ["Active", "Deactivated"],
      default: "Active",
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      default: generateReferralCode,
    },
    referredBy: {
      type: String,
      ref: "User",
      default: null,
    },
    referralCount: { type: Number, default: 0 },
    balance: {
      type: Number,
      default: 3,
      min: [0, "Balance cannot be negative"],
    },
    lastLoginDate: { type: Date, default: null },
    role: {
      type: String,
      enum: ["user", "creator"],
      default: "user",
      required: true,
    },
    verification: {
      twitter: { type: Boolean, default: false },
      discord: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
