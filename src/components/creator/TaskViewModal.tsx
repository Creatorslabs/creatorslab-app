"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { ITask } from "@/types/Task";
import TaskModalTabs from "./TaskModalTabs";
import TaskOverviewTab from "./TaskOverviewTab";
import TaskModalHeader from "./TaskModalHeader";
import TaskModalFooter from "./TaskModalFooter";
import TaskAnalyticsTab from "./TaskAnalyticsTab";
import TaskParticipantsTab from "./TaskParticipantsTab";

export default function TaskViewModal({
  isOpen,
  onClose,
  task,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: ITask | null;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "participants" | "analytics"
  >("overview");

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[1440px] h-full bg-card-box rounded-none overflow-y-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <TaskModalHeader task={task} onClose={onClose} />
            <div className="p-6">
              <TaskModalTabs
                active={activeTab}
                onChange={(tab) => setActiveTab(tab)}
              />
              {activeTab === "overview" && (
                <TaskOverviewTab taskId={task._id} />
              )}
              {activeTab === "participants" && (
                <TaskParticipantsTab taskId={task._id} />
              )}
              {activeTab === "analytics" && (
                <TaskAnalyticsTab taskId={task._id} />
              )}
              <TaskModalFooter updatedAt={task.updatedAt} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
