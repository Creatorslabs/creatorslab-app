import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITaskShare extends Document {
  taskId: mongoose.Types.ObjectId;
  platform?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskShareSchema: Schema<ITaskShare> = new Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    platform: {
      type: String,
      enum: ["clipboard", "facebook", "twitter", "telegram", "whatsapp"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

TaskShareSchema.index({ taskId: 1, createdAt: -1 });

export const TaskShare: Model<ITaskShare> =
  mongoose.models.TaskShare ||
  mongoose.model<ITaskShare>("TaskShare", TaskShareSchema);
