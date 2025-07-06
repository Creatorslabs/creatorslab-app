"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { SimpleIcon } from "./SimpleIcon";
import { cn } from "@/lib/utils";

export const SocialCard = ({
  platform,
  handle,
  linked,
  action,
}: {
  icon: React.ReactNode;
  platform: string;
  handle: string | null | undefined;
  linked: boolean;
  action?: (platform: string) => Promise<void> | void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!action) return;
    setLoading(true);
    try {
      await action(platform.toLowerCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center border border-[#606060] rounded-lg p-4 w-full max-w-[320px]">
      <div className="flex gap-3 items-center">
        <div className="flex justify-center items-center p-2 bg-white rounded-md">
          <SimpleIcon platform={platform} color="#000" />
        </div>
        <span>{linked ? handle : `Link ${platform}`}</span>
      </div>
      <Button
        className={cn(
          "px-4 py-2 rounded-lg bg-card text-foreground hover:bg-card-box",
          { "bg-white/50 text-background hover:bg-white": !linked }
        )}
        variant="default"
        disabled={linked || loading}
        onClick={handleClick}
      >
        {linked ? (
          "Linked"
        ) : loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
