import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITaskComment extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  replyTo?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskCommentSchema: Schema<ITaskComment> = new Schema(
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
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskComment",
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

TaskCommentSchema.index({ taskId: 1, createdAt: -1 });

export const TaskComment: Model<ITaskComment> =
  mongoose.models.TaskComment ||
  mongoose.model<ITaskComment>("TaskComment", TaskCommentSchema);
