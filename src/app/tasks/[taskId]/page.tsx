"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import FollowCreatorModal from "@/components/taskPage/FollowCreatorModal";
import EarnedCLSModal from "@/components/taskPage/EarnedCLSModal";
import WarningModal from "@/components/taskPage/WarningModal";
import SuccessModal from "@/components/taskPage/SuccessModal";
import FollowButton from "@/components/Common/FollowButton";
import { useLinkAccount, usePrivy } from "@privy-io/react-auth";
import { SimpleIcon } from "@/components/Common/SimpleIcon";
import Link from "next/link";
import { ProofSubmissionSection } from "@/components/Common/ProofSubmissionSection";
import TaskNotFound from "@/components/Common/TaskNotFound";
import { logger } from "@/lib/logger";
import { TaskLikeButton } from "@/components/taskActions/TaskLikeButton";
import { parseCount } from "@/lib/helpers/calculateTrendingScore";
import CommentsSection from "@/components/taskPage/CommentsSection";

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
  likes: string;
  comments: string;
  shares: number;
  otherTasks: any[];
  status: "pending" | "completed" | null;
  requirements: string[];
  canParticipate: boolean;
  reason: string | null;
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [params.taskId]);

  const fetchTask = async () => {
    showLoader({ message: "Loading task details..." });

    try {
      const res = await fetch(`/api/tasks/${params.taskId}/details`);

      if (!res.ok) throw new Error("Failed to fetch task.");

      const { data } = await res.json();
      setTask(data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const handleConnectAccount = (platform: string, nextPath?: string) => {
    const supportedPlatforms = ["twitter", "discord", "email"];
    const next = nextPath || window.location.pathname;

    if (!supportedPlatforms.includes(platform)) {
      toast({
        title: "Unsupported platform",
        description: `Cannot link ${platform}`,
        variant: "warning",
      });
      return;
    }

    localStorage.setItem("link_platform", platform);
    localStorage.setItem("link_next", next);

    router.push("/connect");
  };

  const handleTaskComplete = async () => {
    showLoader({ message: "Completing task..." });

    if (!connectedAccounts.twitter) {
      setShowWarningModal(true);
      hideLoader();
      return;
    }

    if (task?.status !== null) {
      toast({
        title: "Task Already Completed",
        description: "You have already completed this task.",
        variant: "warning",
      });
      hideLoader();
      return;
    }

    if (!proofLink) {
      toast({
        title: "Proof Required",
        description: "Please provide a proof link to complete the task.",
        variant: "warning",
      });
      hideLoader();
      return;
    }

    try {
      const res = await fetch("/api/tasks/participate", {
        method: "POST",
        body: JSON.stringify({
          taskId: task?.id,
          userId: privyUser?.id,
          proof: proofLink,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to complete task.",
          variant: "destructive",
        });
        return;
      }

      setEarnedAmount(task?.reward || "0");

      await fetchTask();

      setShowEarnedModal(true);
      setShowSuccessModal(true);
    } catch (error) {
      logger.error("Error completing task:", error);
    } finally {
      hideLoader();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
      variant: "success",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoaderModal />
      </div>
    );
  }

  if (!task) return <TaskNotFound />;

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
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
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="text-2xl font-bold flex-1 min-w-0 break-words">
                    {task.title}
                  </h1>
                  <TaskLikeButton
                    taskId={task.id}
                    initialLikes={parseCount(task.likes)}
                  />
                </div>
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
                <Link
                  href={`/creator/view/${task.creator.username}?back=${window.location.pathname}`}
                  passHref
                >
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-90">
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
                </Link>

                <FollowButton creatorId={task.creator.id} />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card-box border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm">
                  {task.timeRemaining}
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
                      onClick={() =>
                        handleConnectAccount("twitter", `/tasks/${task.id}`)
                      }
                      disabled={!!privyUser?.twitter}
                      className="w-full bg-white hover:bg-secondary py-6 text-background border border-border"
                    >
                      <SimpleIcon platform="x" color="#000" />
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
                      onClick={() =>
                        handleConnectAccount("discord", `/tasks/${task.id}`)
                      }
                      disabled={!!privyUser?.discord}
                      className="w-full bg-blue-700 py-6 hover:bg-blue-800 text-white"
                    >
                      <SimpleIcon platform="discord" />
                      {privyUser?.discord ? "Connected" : "Connect Discord"}
                    </Button>
                  </div>
                )}

                <ProofSubmissionSection
                  status={task.status}
                  proofLink={proofLink}
                  setProofLink={setProofLink}
                  canParticipate={task.canParticipate}
                  reason={task.reason}
                />
              </div>

              <Button
                onClick={handleTaskComplete}
                className="w-full mt-6 py-6 bg-primary hover:bg-primary/80 text-white"
                disabled={
                  !task.canParticipate ||
                  task.status === "completed" ||
                  submitting
                }
              >
                {submitting
                  ? "Submitting..."
                  : task.status === "completed"
                  ? "Task Completed"
                  : task.status === "pending"
                  ? "Waiting for review"
                  : "Submit Proof"}
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
                Other Task from {task.creator.username}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get started with more task to earn more $CLS
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {task.otherTasks.length} task
                {task.otherTasks.length !== 1 ? "s" : ""} available
              </p>

              {task.otherTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center text-gray-400 text-sm py-8"
                >
                  <div className="flex justify-center mb-2">
                    <FolderOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <p>
                    No other tasks available from {task.creator.username} right
                    now.
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Check back later or explore tasks from other creators.
                  </p>
                </motion.div>
              ) : (
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
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card-box border border-border rounded-xl p-6"
            >
              <h3 className="text-white font-semibold mb-4">Comments</h3>
              <CommentsSection taskId={task.id} />
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
