import { Schema, Document, models, model } from "mongoose";

export type AdminStatus = "Active" | "Restricted" | "Banned";
export type AdminRole = "Super Admin" | "Admin" | "Moderator" | "Support";
export type AdminPermission =
  | "User Management"
  | "Task Management"
  | "Engagement Management"
  | "Analytics View"
  | "System Settings"
  | "Admin Management";

export interface IAdmin extends Document {
  name: string;
  email: string;
  role: AdminRole;
  image?: string;
  password: string;
  permissions: AdminPermission[];
  status: AdminStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Moderator", "Support"],
      default: "Admin",
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    permissions: {
      type: [String],
      enum: [
        "User Management",
        "Task Management",
        "Engagement Management",
        "Analytics View",
        "System Settings",
        "Admin Management",
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Restricted", "Banned"],
      default: "Active",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);
