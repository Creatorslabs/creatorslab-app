"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Coins,
  HelpCircle,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import FollowButton from "@/components/Common/FollowButton";
import { Button } from "@/components/ui/button";
import EngagementCard from "@/components/Common/EngagementCard";
import { SimpleIcon } from "@/components/Common/SimpleIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLoader } from "@/hooks/useLoader";
import CreatorNotFound from "@/components/Common/CreatorNotFound";
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

const Page = () => {
  const { creatorUsername } = useParams();
  const [creator, setCreator] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();

  const { showLoader, LoaderModal, hideLoader } = useLoader();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);

  useEffect(() => {
    const fetchCreator = async () => {
      showLoader({ message: "Loading creator..." });
      try {
        const res = await fetch(`/api/creator/public/${creatorUsername}`);
        const data = await res.json();
        setCreator(data.data);
      } catch (err) {
        logger.error("Failed to fetch creator:", err);
      } finally {
        setPageLoading(false);
        hideLoader();
      }
    };

    fetchCreator();
  }, [creatorUsername]);

  useEffect(() => {
    if (!creator?.id) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/tasks?creatorId=${creator.id}&page=${page}`
        );
        const data = await res.json();
        if (page === 1) setTasks(data.data);
        else setTasks((prev) => [...prev, ...data.data]);

        setHasMore(data.pagination.hasMore);
      } catch (err) {
        logger.error("Failed to fetch tasks:", err);
      }
      setLoading(false);
      setFetchingMore(false);
    };

    fetchTasks();
  }, [creator?.id, page]);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading || !isDesktop) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
        setFetchingMore(true);
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef.current, hasMore, loading, isDesktop]);

  if (pageLoading) return <LoaderModal />;
  if (!creator) return <CreatorNotFound username={creatorUsername as string} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto p-4 lg:p-6"
    >
      <div className="w-full py-4 min-h-screen">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white hover:bg-card rounded-md p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <p>User Profile</p>
          </div>
          <Button
            className="bg-card-box hover:bg-card text-foreground font-medium border border-border rounded-md px-4 py-2"
            onClick={() => router.push("/tasks")}
          >
            <Coins className="w-4 h-4 mr-2 text-yellow-500" />
            Earn $CLS
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{
            background:
              window.innerWidth < 768
                ? "linear-gradient(35deg, #0F0529 0%, #016495 27%, #25205C 46%)"
                : "linear-gradient(90deg, #0F0529 0%, #016495 27%, #25205C 46%, #A3452A 63%, #017AA6 83%, #333397 100%)",
          }}
        >
          <div className="bkg-creator-profile py-4">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between flex-wrap gap-4">
              <div className="relative">
                <Image
                  src={creator.image}
                  alt={creator.username}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-border aspect-square object-cover"
                  quality={75}
                  loader={({ src, width, quality }) =>
                    `${src}?w=${width}&q=${quality || 75}`
                  }
                />
              </div>
              <div className="flex items-center flex-col md:flex-row justify-between flex-1 flex-wrap gap-4">
                <div className="flex flex-col gap-2 sm:gap-4 justify-center items-center sm:justify-start sm:items-start">
                  <div className="space-y-5">
                    <p className="sm:text-xl text-white font-bold font-syne">
                      {creator.username}
                    </p>
                    {creator.isVerified ? (
                      <div className="bg-card/70 py-1 px-3 rounded-lg flex gap-2 items-center text-sm">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Verified
                      </div>
                    ) : (
                      <div className="bg-card py-1 px-3 rounded-lg flex gap-2 items-center text-sm">
                        <ShieldX className="w-4 h-4 text-red-600" />
                        Not Verified
                      </div>
                    )}
                  </div>
                  <p className="text-white">
                    {creator?.followers?.length ?? 0}{" "}
                    {creator?.followers?.length === 1
                      ? "follower"
                      : "followers"}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {creator?.twitter ? (
                      <Link
                        href={`https://x.com/${creator.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border border-white/50 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
                      >
                        <SimpleIcon
                          platform="twitter"
                          hasBackground
                          backgroundColor="#fff"
                          color="#000"
                        />
                        <span className="text-white text-sm">
                          @{creator.twitter}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 border border-white/50 px-3 py-1.5 rounded-lg">
                        <SimpleIcon
                          platform="twitter"
                          hasBackground
                          backgroundColor="#fff"
                          color="#000"
                        />
                        <span className="text-white text-sm">Not Linked</span>
                      </div>
                    )}

                    {creator?.discord ? (
                      <Link
                        href={`https://discord.com/users/${creator.discord}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border border-white/50 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
                      >
                        <SimpleIcon
                          platform="discord"
                          hasBackground
                          backgroundColor="#5D3FD1"
                          color="#fff"
                        />
                        <span className="text-white text-sm">
                          {creator.discord}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 border border-white/50 px-3 py-1.5 rounded-lg">
                        <SimpleIcon
                          platform="discord"
                          hasBackground
                          backgroundColor="#5D3FD1"
                          color="#fff"
                        />
                        <span className="text-white text-sm">Not Linked</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <FollowButton creatorId={creator.id} isLiquidGlass />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="bg-white bg-opacity-20 p-2 rounded-lg flex gap-2 items-center text-sm text-white">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="text-xs bg-card text-foreground"
                    >
                      You are viewing {creator.username}&apos;s profile
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between pb-6 mt-8"
        >
          <p className="flex-1">All tasks</p>
        </motion.div>

        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center"
          >
            Loading tasks...
          </motion.p>
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
              This creator has not created any task before. Created task will
              appear her in the future.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <EngagementCard index={index} card={task} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex justify-center items-center mt-6"
            >
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
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Page;
