"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Users, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, getTimeRemaining } from "@/lib/helpers/date-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { logger } from "@/lib/logger";

interface Props {
  taskId: string;
}

interface TaskOverviewData {
  creator: {
    username: string;
    image?: string;
  };
  title: string;
  target: string;
  description: string;
  type: string[];
  expiration?: Date;
  createdAt?: Date;
  currentParticipants: number;
  maxParticipants: number;
}

const isValidLink = (url?: string) => {
  try {
    if (!url) return false;
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function TaskOverviewTab({ taskId }: Props) {
  const [task, setTask] = useState<TaskOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tasks/${taskId}/overview`);
        const data = await res.json();
        setTask(data);
      } catch (error) {
        logger.error("Error fetching overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [taskId]);

  const participationRate = task?.maxParticipants
    ? Math.round((task.currentParticipants / task.maxParticipants) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Creator Info */}
      <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
        {loading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </>
        ) : (
          <>
            <Image
              src={task?.creator.image || "/default-avatar.png"}
              alt={task?.creator.username || "User"}
              width={48}
              height={48}
              className="rounded-full"
              quality={75}
              loader={({ src, width, quality }) =>
                `${src}?w=${width}&q=${quality || 75}`
              }
            />
            <div>
              <p className="font-medium text-white">
                Created by {task?.creator.username}
              </p>
              <p className="text-sm text-gray-400">
                {task?.createdAt
                  ? formatDate(task.createdAt)
                  : "Recently created"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Task Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg w-full" />
          ))
        ) : (
          <>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-400">
                  Target
                </span>
              </div>

              {isValidLink(task?.target) ? (
                <Link
                  href={task?.target || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {task?.target}
                </Link>
              ) : (
                <div>
                  <p className="text-white break-all">{task?.target}</p>
                  <p className="text-red-500 text-sm mt-1">
                    This is not a valid external link
                  </p>
                </div>
              )}
            </div>

            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-400">
                  Participants
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {task?.currentParticipants || 0} / {task?.maxParticipants}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${participationRate}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400">
                  {participationRate}%
                </span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-400">
                  Time Remaining
                </span>
              </div>
              <p className="text-white font-medium">
                {getTimeRemaining(task?.expiration)}
              </p>
            </div>

            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-400">
                  Expires
                </span>
              </div>
              <p className="text-white">{formatDate(task?.expiration)}</p>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      {loading ? (
        <Skeleton className="h-28 rounded-lg w-full" />
      ) : (
        <div className="bg-background rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">{task?.description}</p>
        </div>
      )}

      {/* Engagement Types */}
      {loading ? (
        <Skeleton className="h-20 rounded-lg w-full" />
      ) : (
        <div className="bg-background rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Required Actions</h3>
          <div className="flex flex-wrap gap-2">
            {task?.type.map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
