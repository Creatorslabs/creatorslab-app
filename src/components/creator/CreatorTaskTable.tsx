"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SimpleIcon } from "../Common/SimpleIcon";
import { Button } from "../ui/button";
import TaskViewModal from "./TaskViewModal";

interface Task {
  id: string;
  platform: string;
  taskDetail: string;
  category: string;
  rewardPoints: string;
  textStatus: "Ongoing" | "Finished";
}

interface Props {
  tasks: Task[];
}

export const CreatorTaskTable = ({ tasks }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<any | null>();
  const [isOpen, setIsOpen] = useState(false);
  const pageSize = 5;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      `${task.platform} ${task.taskDetail}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tasks]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  const handleModalOpen = (task: any) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setSelectedTask(null);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-xl p-6 border border-border"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">All Tasks</h3>
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchQuery(e.target.value);
            }}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No tasks found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                  S/N
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                  Platform
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                  Task Detail
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="border-b border-border/50 hover:bg-background/50 transition-colors"
                >
                  <td className="py-4 px-2 text-sm">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <SimpleIcon platform={task.platform} />
                      <span className="text-sm">{task.platform}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-secondary border-secondary/30 hover:bg-secondary/60 hover:text-white"
                      onClick={() => handleModalOpen(task)}
                    >
                      View
                    </Button>
                  </td>
                  <td className="py-4 px-2 text-sm font-medium">
                    {task.rewardPoints} $CLS
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`text-sm font-medium ${
                        task.textStatus === "Ongoing"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {task.textStatus}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded-lg ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      <TaskViewModal
        isOpen={isOpen}
        task={selectedTask}
        onClose={handleModalClose}
      />
    </motion.div>
  );
};
