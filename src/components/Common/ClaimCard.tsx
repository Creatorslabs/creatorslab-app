"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SimpleIcon } from "./SimpleIcon";
import { toast } from "@/hooks/use-toast";

interface ClaimCardProps {
  claim: {
    id: string;
    task: string;
    platform: string;
    amount: string;
    status: string;
    canClaim: boolean;
  };
  index: number;
  onClaim: (taskId: string) => void;
}

export default function ClaimCard({ claim, index, onClaim }: ClaimCardProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!claim.canClaim) return;
    setLoading(true);
    try {
      await onClaim(claim.id);
    } catch (err: any) {
      toast({
        title: (err as Error).message || "Failed to claim reward",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={claim.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
    >
      <div className="flex items-center gap-3">
        <SimpleIcon platform={claim.platform} />
        <div>
          <p className="text-sm font-medium">{claim.task}</p>
          <p className="text-sm text-blue-400 font-medium">{claim.amount}</p>
        </div>
      </div>
      <Button
        onClick={handleClick}
        disabled={!claim.canClaim || loading}
        className={`${
          claim.canClaim ? "bg-yellow-500" : "bg-secondary"
        } hover:bg-yellow-600 text-black font-medium px-4 py-2 flex items-center justify-center`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : claim.canClaim ? (
          "Claim"
        ) : (
          claim.status
        )}
      </Button>
    </motion.div>
  );
}
