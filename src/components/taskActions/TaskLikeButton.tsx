"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TaskLikeButtonProps {
  taskId: string;
  initialLikes: number;
}

export const TaskLikeButton = ({
  taskId,
  initialLikes,
}: TaskLikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}/like/status`);
        const data = await res.json();

        if (res.ok) {
          setHasLiked(data.liked);
        } else {
          throw new Error(data.message || "Could not load like status");
        }
      } catch (error: any) {
        toast({
          title: "Failed to load like status",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchLikedStatus();
  }, [taskId]);

  const toggleLike = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}/like`, {
          method: hasLiked ? "DELETE" : "POST",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to update like");
        }

        setHasLiked(!hasLiked);
        setLikes(data.totalLikes);
      } catch (error: any) {
        toast({
          title: "Error updating like",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  const isLoading = hasLiked === null || isPending;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleLike}
          disabled={isLoading}
          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-card transition-all duration-200
    ${hasLiked ? "text-red-500" : "text-white"} 
    ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition 
      ${
        hasLiked
          ? "fill-red-500 stroke-red-500"
          : "fill-transparent stroke-white"
      }`}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-card-box text-sm text-foreground"
      >
        <p>
          {likes} like{likes !== 1 ? "s" : ""}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
