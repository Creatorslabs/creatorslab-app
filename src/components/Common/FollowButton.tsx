"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type FollowButtonProps = {
  creatorId: string; // ID of the user to follow
  onFollowClick?: () => void;
};

export default function FollowButton({
  creatorId,
  onFollowClick,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isSelf, setIsSelf] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFollowStatus = async () => {
    if (!creatorId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/follow/status/${creatorId}`);
      const json = await res.json();
      if (json.success) {
        setIsFollowing(json.isFollowing);
        setIsSelf(json.isSelf);
      }
    } catch (err) {
      console.error("Error fetching follow status:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (!creatorId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/follow/${isFollowing ? "unfollow" : "follow"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorId }),
        }
      );

      const json = await res.json();

      console.log(json);
      
      if (json.success) {
        setIsFollowing(!isFollowing);
        if (onFollowClick) onFollowClick();
      }
    } catch (err) {
      console.error("Follow toggle failed:", err);
      toast({
        title: "Failed to follow",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowStatus();
  }, [creatorId]);

  return (
    <Button
      onClick={toggleFollow}
      disabled={loading || isFollowing === null || isSelf}
      className="bg-primary hover:bg-primary/80 text-white px-6"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
