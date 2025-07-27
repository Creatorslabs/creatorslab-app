import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITaskLike extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskLikeSchema: Schema<ITaskLike> = new Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

TaskLikeSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export const TaskLike: Model<ITaskLike> =
  mongoose.models.TaskLike ||
  mongoose.model<ITaskLike>("TaskLike", TaskLikeSchema);
