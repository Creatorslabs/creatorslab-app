import { BalanceHistory } from "@/lib/models/BalanceHistory";
import mongoose from "mongoose";
import connectDB from "../connectDB";

export const logBalanceTransaction = async ({
  userId,
  type,
  amount,
}: {
  userId: string | mongoose.Types.ObjectId;
  type:
    | "signup_bonus"
    | "follow_creator"
    | "unfollow_creator"
    | "buy_cls"
    | "convert_cls"
    | "create_task"
    | "completed_task";
  amount: number;
}) => {
  await connectDB();

  await BalanceHistory.create({
    userId,
    type,
    amount,
    currency: "CLS",
    interface: "system",
    timestamp: new Date(),
  });
};
