import mongoose from "mongoose";
import { logger } from "@/lib/logger";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Extend the NodeJS.Global interface to include mongoose
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
} else {
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    // logger.log("No cached promise found, creating new connection promise");

    cached!.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        // logger.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        logger.error("MongoDB connection error:", error);
        throw error;
      });
  } else {
    // logger.log("Using existing cached promise for connection");
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    logger.error("Error while awaiting connection promise:", e);
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
