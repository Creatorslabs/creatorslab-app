import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  level: "log" | "warn" | "error" | "info";
  message: string;
  meta?: any;
  environment: "development" | "production";
  isClient: boolean;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    level: {
      type: String,
      enum: ["log", "warn", "error", "info"],
      required: true,
    },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    environment: { type: String, required: true },
    isClient: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
