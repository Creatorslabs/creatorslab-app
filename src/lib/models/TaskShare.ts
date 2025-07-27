import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITaskShare extends Document {
  taskId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskShareSchema: Schema<ITaskShare> = new Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
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
