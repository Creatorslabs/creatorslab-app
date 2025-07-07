"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, CheckCircle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import FollowCreatorModal from "@/components/taskPage/FollowCreatorModal";
import EarnedCLSModal from "@/components/taskPage/EarnedCLSModal";
import WarningModal from "@/components/taskPage/WarningModal";
import SuccessModal from "@/components/taskPage/SuccessModal";
import FollowButton from "@/components/Common/FollowButton";
import { usePrivy } from "@privy-io/react-auth";
import { SimpleIcon } from "@/components/Common/SimpleIcon";
import Link from "next/link";
import { ProofSubmissionSection } from "@/components/Common/ProofSubmissionSection";

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
  otherTasks: any[];
  status: "pending" | "completed" | null;
  requirements: string[];
}

export default function TaskViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showLoader, hideLoader, LoaderModal } = useLoader();
  const { user: privyUser } = usePrivy();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showEarnedModal, setShowEarnedModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState("0.5");
  const [proofLink, setProofLink] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState({
    twitter: false,
    telegram: false,
  });

  useEffect(() => {
    const fetchTask = async () => {
      showLoader({ message: "Loading task details..." });

      try {
        const res = await fetch(`/api/tasks/${params.taskId}/details`);

        if (!res.ok) throw new Error("Failed to fetch task.");

        const { data } = await res.json();

        setTask(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchTask();
  }, [params.taskId]);

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
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl p-6 overflow-hidden text-white"
              style={{
                backgroundImage: `url(${task.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/60 z-0" />

              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 z-10 flex items-center justify-center">
                <SimpleIcon
                  platform={task.platform}
                  className="w-6 h-6 text-white"
                />
              </div>

              <div className="relative z-10 mt-12">
                <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
              </div>
            </motion.div>

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

              <div className="space-y-4">
                {task.requirements.map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-card-box border border-border rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-white">{requirement}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-white text-sm mb-2">Visit link</p>
                  <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
                    <span className="text-gray-400 text-sm flex-1 truncate">
                      {task.target}
                    </span>

                    <Link
                      href={task.target}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white h-8 w-8 flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

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

                {!privyUser?.twitter && (
                  <div>
                    <p className="text-white text-sm mb-2">Connect your X</p>
                    <Button
                      onClick={() => handleConnectAccount("twitter")}
                      disabled={!!privyUser?.twitter}
                      className="w-full bg-white hover:bg-secondary py-6 text-background border border-border"
                    >
                      <span className="mr-2">𝕏</span>
                      {privyUser?.twitter ? "Connected" : "Connect Twitter"}
                    </Button>
                  </div>
                )}

                {!privyUser?.discord && (
                  <div>
                    <p className="text-white text-sm mb-2">
                      Connect your Discord
                    </p>
                    <Button
                      onClick={() => handleConnectAccount("discord")}
                      disabled={!!privyUser?.discord}
                      className="w-full bg-blue-700 py-6 hover:bg-blue-800 text-white"
                    >
                      <span className="mr-2">📱</span>
                      {privyUser?.discord ? "Connected" : "Connect Discord"}
                    </Button>
                  </div>
                )}

                <ProofSubmissionSection
                  status={task.status} // "pending" | "completed" | null
                  taskId={task.id}
                  proofLink={proofLink}
                  setProofLink={setProofLink}
                />
              </div>

              <Button
                onClick={() => setShowSuccessModal(true)}
                className="w-full mt-6 py-6 bg-primary hover:bg-primary/80 text-white"
              >
                Complete
              </Button>
            </motion.div>
          </div>

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

              <div className="space-y-4">
                {task.otherTasks.map((otherTask, index) => (
                  <motion.div
                    key={otherTask.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => router.push(`/tasks/${otherTask.id}`)}
                    className="p-4 bg-card border border-border rounded-xl hover:border-primary/60 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <SimpleIcon
                          platform={otherTask.platform}
                          className="w-5 h-5 text-primary"
                        />
                      </div>
                      <span className="text-sm text-white font-medium truncate">
                        {otherTask.title}
                      </span>
                    </div>

                    <div className="mt-3 self-start bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold">
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
