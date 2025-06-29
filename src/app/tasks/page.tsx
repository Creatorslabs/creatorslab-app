"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import EngagementCard from "@/components/Common/EngagementCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

export default function TasksPage() {
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

  // Set desktop state
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);

  // Reset tasks on filter/search change
  useEffect(() => {
    setPage(1);
    setTasks([]);
    setLoading(true);
    fetchTasks(1, true);
  }, [sort, platform, search]);

  // Fetch more when page changes (excluding first page)
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
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  // Intersection Observer (load more)
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-20 md:top-24 z-20 bg-card-box backdrop-blur-md border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between"
      >
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Select
            value={sort}
            onValueChange={(val: string) => updateParam("sort", val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={platform}
            onValueChange={(val: string) => updateParam("platform", val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" onClick={clearFilters}>
          Clear Filters
        </Button>
      </motion.div>

      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks found.</p>
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

            {/* Invisible trigger still needed for desktop scroll */}
            {isDesktop && <div ref={observerRef} className="h-1" />}
          </div>
        </>
      )}
    </div>
  );
}
