"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import FollowCreatorModal from "@/components/taskPage/FollowCreatorModal";
import EarnedCLSModal from "@/components/taskPage/EarnedCLSModal";
import WarningModal from "@/components/taskPage/WarningModal";
import SuccessModal from "@/components/taskPage/SuccessModal";
import FollowButton from "@/components/Common/FollowButton";

interface Task {
  id: string;
  title: string;
  description: string;
  image: string;
  reward: string;
  platform: string;
  type: string[];
  creator: {
    id: string;
    username: string;
    image: string;
  };
  timeRemaining: string;
  participants: number;
  maxParticipants: number;
  target: string;
  requirements: string[];
}

export default function TaskViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showLoader, hideLoader, LoaderModal } = useLoader();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showEarnedModal, setShowEarnedModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState("0.5");
  const [connectedAccounts, setConnectedAccounts] = useState({
    twitter: false,
    telegram: false,
  });

  // Mock task data
  const mockTask: Task = {
    id: params.taskId as string,
    title: "Follow CEO Abayomi Chukwudi on X",
    description:
      "Follow TH CEO Abayomi Chukwudi on X! If you're already following Abayomi, simply complete the quest again to claim the $CLS.",
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    reward: "0.8",
    platform: "twitter",
    type: ["follow"],
    creator: {
      id: "creator_123",
      username: "Barbie_xy",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
    },
    timeRemaining: "12h : 40m : 24s",
    participants: 1250,
    maxParticipants: 5000,
    target: "https://www.CreatorsLab?node-id=80-586&node-type=frame&t=Myuuav",
    requirements: [
      "Follow CEO Abayomi Chukwudi on X",
      "Join the TH community Discord server",
      "Sign up for THX",
    ],
  };

  const otherTasks = [
    {
      id: "1",
      title: "Follow CEO Abayomi Chukwudi on X",
      reward: "0.8",
      platform: "twitter",
    },
    {
      id: "2",
      title: "Join the TH community Discord server",
      reward: "0.5",
      platform: "discord",
    },
    {
      id: "3",
      title: "Sign up for THX",
      reward: "0.7",
      platform: "website",
    },
  ];

  useEffect(() => {
    const fetchTask = async () => {
      showLoader({ message: "Loading task details..." });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTask(mockTask);
      setLoading(false);
      hideLoader();
    };

    fetchTask();
  }, [params.taskId]);

  const vicvo = () => {};

  const handleConnectAccount = (platform: string) => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [platform]: true,
    }));

    toast({
      title: "Account Connected",
      description: `Your ${platform} account has been connected successfully!`,
      variant: "success",
    });
  };

  const handleTaskComplete = (taskId: string) => {
    // Check if mandatory tasks are completed
    if (taskId === "1" && !connectedAccounts.twitter) {
      setShowWarningModal(true);
      return;
    }

    setEarnedAmount("0.5");
    setShowEarnedModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
      variant: "success",
    });
  };

  if (loading || !task) {
    return (
      <div className="min-h-screen bg-background">
        <LoaderModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white font-bold text-lg">Th</span>
              </div>

              <div className="mt-12">
                <h1 className="text-2xl font-bold text-white mb-4">
                  {task.title}
                </h1>
              </div>
            </motion.div>

            {/* Creator Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card-box border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Creator</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={task.creator.image}
                    alt={task.creator.username}
                    width={40}
                    height={40}
                    className="rounded-full aspect-square"
                    quality={75}
                    loader={({ src, width, quality }) =>
                      `${src}?w=${width}&q=${quality || 75}`
                    }
                  />
                  <span className="text-white font-medium">
                    {task.creator.username}
                  </span>
                </div>

                <FollowButton creatorId={task.creator.id} />
              </div>
            </motion.div>

            {/* Task Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card-box border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm">
                  Ending in {task.timeRemaining}
                </div>
                <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                  <span>💰</span>
                  $CLS {task.reward}
                </div>
              </div>

              <p className="text-gray-300 mb-6">{task.description}</p>

              <div className="mb-6">
                <p className="text-white mb-2">To learn more:</p>
                <div className="flex items-center gap-2">
                  <a
                    href={task.target}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all"
                  >
                    {task.target}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(task.target)}
                    className="text-gray-400 hover:text-white h-8 w-8"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Task Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">
                    Follow CEO Abayomi Chukwudi on X
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-blue-400 hover:text-blue-300"
                  >
                    Link & Verify
                  </Button>
                </div>
              </div>

              {/* Social Connections */}
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-white text-sm mb-2">Visit link</p>
                  <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
                    <span className="text-gray-400 text-sm flex-1 truncate">
                      /CreatorsLab?node-id=80-586&MyuuavBcuClStOrM-0
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(task.target)}
                      className="text-gray-400 hover:text-white h-8 w-8"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-white text-sm mb-2">Connect your X</p>
                  <Button
                    onClick={() => handleConnectAccount("twitter")}
                    disabled={connectedAccounts.twitter}
                    className="w-full bg-white hover:bg-secondary py-6 text-background border border-border"
                  >
                    <span className="mr-2">𝕏</span>
                    {connectedAccounts.twitter
                      ? "Connected"
                      : "Connect Twitter"}
                  </Button>
                </div>

                <div>
                  <p className="text-white text-sm mb-2">
                    Connect your Telegram
                  </p>
                  <Button
                    onClick={() => handleConnectAccount("telegram")}
                    disabled={connectedAccounts.telegram}
                    className="w-full bg-blue-500 py-6 hover:bg-blue-600 text-white"
                  >
                    <span className="mr-2">📱</span>
                    {connectedAccounts.telegram
                      ? "Connected"
                      : "Connect Telegram"}
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowSuccessModal(true)}
                className="w-full mt-6 py-6 bg-primary hover:bg-primary/80 text-white"
              >
                Complete
              </Button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card-box border border-border rounded-xl p-6"
            >
              <h3 className="text-white font-semibold mb-2">
                Other Task from TH
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get started with more task to earn more $CLS
              </p>
              <p className="text-gray-400 text-sm mb-6">0 / 3</p>

              <div className="space-y-3">
                {otherTasks.map((otherTask, index) => (
                  <motion.div
                    key={otherTask.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleTaskComplete(otherTask.id)}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
                        {otherTask.platform === "twitter" && (
                          <span className="text-xs">𝕏</span>
                        )}
                        {otherTask.platform === "discord" && (
                          <span className="text-xs">💬</span>
                        )}
                        {otherTask.platform === "website" && (
                          <span className="text-xs">🌐</span>
                        )}
                      </div>
                      <span className="text-white text-sm">
                        {otherTask.title}
                      </span>
                    </div>
                    <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                      $CLS {otherTask.reward}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FollowCreatorModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      />
      <EarnedCLSModal
        isOpen={showEarnedModal}
        onClose={() => setShowEarnedModal(false)}
        amount={earnedAmount}
      />
      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <LoaderModal />
    </div>
  );
}
