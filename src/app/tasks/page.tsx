"use client";

import { Button } from "@/components/ui/button";
import EngagementCard from "@/components/Common/EngagementCard";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import FilterControls from "@/components/taskPage/FilterControls";
import { logger } from "@/lib/logger";

interface TaskCard {
  id: string;
  title: string;
  description: string;
  image: string;
  reward: string;
  likes: string;
  comments: string;
  shares: string;
  gradient: string;
  avatar: string;
  expiration: Date;
}

const sortOptions = ["newest", "oldest", "trending"];
const platforms = [
  "all",
  "twitter",
  "telegram",
  "discord",
  "instagram",
  "youtube",
];

function TasksPage() {
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const sort = searchParams.get("sort") || "newest";
  const platform = searchParams.get("platform") || "all";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setTasks([]);
    setLoading(true);
    fetchTasks(1, true);
  }, [sort, platform, search]);

  useEffect(() => {
    if (page === 1) return;
    setFetchingMore(true);
    fetchTasks(page);
  }, [page]);

  const fetchTasks = async (targetPage: number, reset = false) => {
    try {
      const params = new URLSearchParams({
        sort,
        platform,
        page: targetPage.toString(),
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const json = await res.json();
      const newTasks = json?.data || [];

      setHasMore(newTasks.length > 0);
      if (reset) {
        setTasks(newTasks);
      } else {
        setTasks((prev) => [...prev, ...newTasks]);
      }
    } catch (err) {
      logger.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading || !isDesktop) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef.current, hasMore, loading, isDesktop]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/tasks?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/tasks");
  };

  return (
    <div className="min-h-screen bg-background px-4 lg:px-8 py-6 text-white">
      {/* Filters */}
      <FilterControls
        platform={platform}
        sort={sort}
        sortOptions={sortOptions}
        platforms={platforms}
        updateParam={updateParam}
        clearFilters={clearFilters}
      />

      {loading ? (
        <p className="text-gray-400 text-center">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full py-12 flex flex-col items-center justify-center bg-card border border-border rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75h4.5m-8.25 8.25h12a1.5 1.5 0 001.5-1.5V7.5a1.5 1.5 0 00-1.5-1.5h-12a1.5 1.5 0 00-1.5 1.5v9a1.5 1.5 0 001.5 1.5z"
            />
          </svg>
          <h3 className="text-white text-lg font-semibold mb-1">
            No Tasks Found
          </h3>
          <p className="text-sm text-gray-400 mb-4 max-w-md text-center">
            There are currently no tasks that match your filters or search.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tasks.map((task, index) => (
              <EngagementCard index={index} card={task} key={task.id + index} />
            ))}
          </motion.div>

          <div className="w-full flex justify-center items-center mt-6">
            {fetchingMore ? (
              <div className="animate-spin w-6 h-6 border-2 border-t-transparent border-border rounded-full" />
            ) : (
              hasMore &&
              !isDesktop && (
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  variant="outline"
                  className="text-white"
                >
                  Load More
                </Button>
              )
            )}
            {isDesktop && <div ref={observerRef} className="h-1" />}
          </div>
        </>
      )}
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TasksPage />
    </Suspense>
  );
}
