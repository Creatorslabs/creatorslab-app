import { Schema, model, models, Document } from "mongoose";

export interface IParticipation extends Document {
  userId: string;
  taskId: string;
  status: "pending" | "completed";
  proof?: string;
  createdAt?: Date;
}

const ParticipationSchema = new Schema<IParticipation>(
  {
    userId: { type: String, ref: "User", required: true },
    taskId: { type: String, ref: "Task", required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    proof: String,
  },
  { timestamps: true }
);

ParticipationSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export const Participation =
  models.Participation ||
  model<IParticipation>("Participation", ParticipationSchema);
