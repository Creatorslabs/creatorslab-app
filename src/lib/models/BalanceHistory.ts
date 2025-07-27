import mongoose, { Schema, Document } from "mongoose";

export type BalanceActionType =
  | "signup_bonus"
  | "follow_creator"
  | "unfollow_creator"
  | "buy_cls"
  | "convert_cls"
  | "create_task"
  | "completed_task"
  | "daily_login";

export interface IBalanceHistory extends Document {
  userId: mongoose.Types.ObjectId;
  type: BalanceActionType;
  amount: number;
  currency: "CLS";
  interface: "system";
  timestamp: Date;
}

const BalanceHistorySchema = new Schema<IBalanceHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "signup_bonus",
        "follow_creator",
        "unfollow_creator",
        "buy_cls",
        "convert_cls",
        "create_task",
        "completed_task",
        "daily_login",
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "CLS",
    },
    interface: {
      type: String,
      default: "system",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const BalanceHistory =
  mongoose.models.BalanceHistory ||
  mongoose.model("BalanceHistory", BalanceHistorySchema);
