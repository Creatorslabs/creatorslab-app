import { Schema, model, models, Document } from "mongoose";

export interface ITask extends Document {
  creator: string;
  title: string;
  type: string[]; // multiple engagement types
  platform: string; // single social platform
  image: string;
  description: string;
  target: string;
  rewardPoints: number;
  maxParticipants: number;
  status: "active" | "completed" | "inactive";
  expiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    creator: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: [String], required: true },
    platform: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String, required: true },
    description: { type: String, required: true },
    target: { type: String, required: true },
    rewardPoints: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "inactive"],
      default: "active",
    },
    expiration: Date,
  },
  { timestamps: true }
);

// Validate platform and engagement types
TaskSchema.pre("validate", async function (next) {
  try {
    const engagement = await models.Engagement.findOne({
      socialPlatform: this.platform,
    }).collation({ locale: "en", strength: 2 });

    if (!engagement) {
      return next(new Error(`Platform "${this.platform}" is not supported.`));
    }

    const invalidTypes = this.type.filter(
      (t: string) => !engagement.engagementType.includes(t)
    );

    if (invalidTypes.length > 0) {
      return next(
        new Error(
          `Invalid engagement type(s) for platform "${
            this.platform
          }": ${invalidTypes.join(", ")}`
        )
      );
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

export const Task = models.Task || model<ITask>("Task", TaskSchema);
