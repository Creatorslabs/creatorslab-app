"use client";

import { useQuery } from "@tanstack/react-query";
import { CreatorTaskTable } from "@/components/creator/CreatorTaskTable";
import { useLoader } from "@/hooks/useLoader";

interface Task {
  id: string;
  platform: string;
  taskDetail: string;
  category: string;
  rewardPoints: string;
  textStatus: "Ongoing" | "Finished";
}

export default function CreatorTasks() {
  const { showLoader, hideLoader, LoaderModal } = useLoader();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["creatorTasks"],
    queryFn: async () => {
      showLoader({ message: "Loading tasks..." });
      try {
        const res = await fetch("/api/user/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const { data } = await res.json();
        return data as Task[];
      } finally {
        hideLoader();
      }
    },
  });

  if (isLoading || !tasks) {
    return <LoaderModal />;
  }

  return <CreatorTaskTable tasks={tasks} />;
}
