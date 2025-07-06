"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskAnalyticsData {
  totalParticipants: number;
  participationRate: number;
  totalDistributed: number;
  averageCompletionTime: string;
  successRate: number;
}

interface Props {
  taskId: string;
}

export default function TaskAnalyticsTab({ taskId }: Props) {
  const [analytics, setAnalytics] = useState<TaskAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tasks/${taskId}/analytics`);
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [taskId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-24 bg-background rounded-lg" />
            <Skeleton className="h-24 bg-background rounded-lg" />
            <Skeleton className="h-24 bg-background rounded-lg" />
          </>
        ) : (
          <>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {analytics?.totalParticipants}
              </div>
              <div className="text-sm text-gray-400">Total Participants</div>
            </div>

            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {analytics?.participationRate}%
              </div>
              <div className="text-sm text-gray-400">Completion Rate</div>
            </div>

            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {analytics?.totalDistributed}
              </div>
              <div className="text-sm text-gray-400">
                Total $CLS Distributed
              </div>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-36 bg-background rounded-lg" />
      ) : (
        <div className="bg-background rounded-lg p-4">
          <h3 className="font-medium text-white mb-4">Performance Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Engagement Rate</span>
              <span className="text-white font-medium">
                {analytics?.participationRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Completion Time</span>
              <span className="text-white font-medium">
                {analytics?.averageCompletionTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-white font-medium">
                {analytics?.successRate}%
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
