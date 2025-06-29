"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WelcomeModal from "@/components/WelcomeModal";
import EngageFilters from "@/components/Home/EngageFilters";
import TopCreators from "@/components/Home/TopCreators";
import EngagementCard from "@/components/Common/EngagementCard";
import PurchaseEarnCard from "@/components/Home/PurchaseEarnCard";
import CTA from "@/components/Home/CTA";
import { useLoader } from "@/hooks/useLoader";
import Link from "next/link";

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

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [trendingTasks, setTrendingTasks] = useState<TaskCard[]>([]);
  const [taskCards, setTaskCards] = useState<TaskCard[]>([]);
  const { showLoader, hideLoader, LoaderModal } = useLoader();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        showLoader({ message: "Loading tasks..." });

        const res = await fetch("/api/home");
        const data = await res.json();

        if (data.success) {
          setTaskCards(data.data.newestTask);
          setTrendingTasks(data.data.trendingTask);
        } else {
          console.error("Failed to load tasks:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        hideLoader();
      }
    };

    fetchTasks();
  }, []);

  const handleSignUp = () => {
    setShowWelcomeModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="p-4 lg:p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4"
        >
          <EngageFilters />
          <TopCreators />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <h3 className="text-lg font-semibold">New Tasks</h3>
          <div className="flex items-center gap-2">
            <Link href="/tasks" className="text-sm text-gray-400">Show all (20)</Link>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {taskCards.slice(0,3).map((card, index) => (
            <EngagementCard index={index} card={card} key={card.id} />
          ))}
        </div>

        {/* Purchase and Earn Cards */}
        <PurchaseEarnCard />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mb-6"
        >
          <h3 className="text-lg font-semibold">Trending Tasks</h3>
          <div className="flex items-center gap-2">
            <Link href="/tasks?sort=trending" className="text-sm text-gray-400">
              Show all (20)
            </Link>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {trendingTasks.slice(0,3).map((card, index) => (
            <EngagementCard index={index} card={card} key={card.id} />
          ))}
        </div>

        <CTA handleSignUp={handleSignUp} />
      </div>

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
      <LoaderModal />
    </div>
  );
}
