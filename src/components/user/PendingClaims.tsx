"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import ClaimCard from "@/components/Common/ClaimCard";

interface PendingClaim {
  id: string;
  task: string;
  amount: string;
  platform: string;
  canClaim: boolean;
  isClaimed: boolean;
  status: string;
}

const fetchPendingClaims = async (): Promise<PendingClaim[]> => {
  const res = await fetch("/api/user/pending-claims");
  if (!res.ok) throw new Error("Failed to fetch pending claims");
  const { data } = await res.json();
  return data;
};

export default function PendingClaims() {
  const queryClient = useQueryClient();

  const { data: claims = [], isLoading } = useQuery<PendingClaim[]>({
    queryKey: ["pendingClaims"],
    queryFn: fetchPendingClaims,
  });

  const claimMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch("/api/user/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim reward");
      return data;
    },
    onSuccess: () => {
      toast({ title: "Reward claimed!", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["pendingClaims"] });
    },
    onError: (err: any) => {
      toast({
        title: err.message || "Failed to claim reward",
        variant: "error",
      });
    },
  });

  return (
    <motion.div
      className="border border-border p-6 rounded-xl mt-6 overflow-y-auto max-h-[400px] scrollbar-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-lg mb-2">My Rewards</p>
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            Loading claims...
          </div>
        ) : claims.length > 0 ? (
          claims.map((claim, index) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              index={index}
              onClaim={(id) => claimMutation.mutate(id)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No pending claims</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
