"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FollowCreatorModal from "../taskPage/FollowCreatorModal";
import UnfollowCreatorModal from "../taskPage/UnfollowCreatorModal";
import { logger } from "@/lib/logger";

type FollowButtonProps = {
  creatorId: string;
  onFollowClick?: () => void;
  isLiquidGlass?: boolean;
};

export default function FollowButton({
  creatorId,
  onFollowClick,
  isLiquidGlass = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isSelf, setIsSelf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

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
      logger.error("Error fetching follow status:", err);
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

      if (!res.ok) {
        toast({
          title: "Follow Failed",
          description: json.message || "An unknown error occurred.",
          variant: "destructive",
        });
        return;
      }

      if (json.success) {
        setIsFollowing(!isFollowing);
        if (onFollowClick) onFollowClick();
      }
    } catch (err) {
      logger.error("Follow toggle failed:", err);
      toast({
        title: "Network Error",
        description:
          (err as Error).message || "Could not toggle follow status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowStatus();
  }, [creatorId]);

  const handleButtonClick = () => {
    if (isFollowing) {
      setShowUnfollowModal(true);
    } else {
      setShowFollowModal(true);
    }
  };

  const baseClasses = "px-6 text-white transition";
  const defaultClasses = "bg-primary hover:bg-primary/80";
  const liquidGlassClasses =
    "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20";

  return (
    <>
      <Button
        onClick={handleButtonClick}
        disabled={loading || isFollowing === null || isSelf}
        className={`${baseClasses} ${
          isLiquidGlass ? liquidGlassClasses : defaultClasses
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          "Unfollow"
        ) : (
          "Follow"
        )}
      </Button>

      <FollowCreatorModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        handleFollow={toggleFollow}
      />

      <UnfollowCreatorModal
        isOpen={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        userId={creatorId}
        handleUnfollow={toggleFollow}
      />
    </>
  );
}
