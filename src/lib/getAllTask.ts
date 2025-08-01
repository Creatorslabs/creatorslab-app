import { Task } from "@/lib/models/Task";
import connectDB from "./connectDB";

export async function getAllTasks() {
  await connectDB();

  const tasks = await Task.find({}, "_id").lean();

  return tasks;
}
