"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export const DailyClaimModal = () => {
  const [open, setOpen] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/daily-claim/status");
      const data = await res.json();

      if (data.success) {
        setCanClaim(data.canClaim);
        setCountdown(data.countdown || 0);
        setClaimed(!data.canClaim);
      } else {
        throw new Error();
      }
    } catch {
      toast({
        title: "Failed to fetch claim status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setClaiming(true);
      const res = await fetch("/api/daily-claim/claim", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast({ title: "🎉 You've claimed 5 $CLS!" });
        setCanClaim(false);
        setClaimed(true);
        setCountdown(86400); // reset countdown to 24hr
      } else {
        toast({
          title: data.message || "Already claimed",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Failed to claim reward",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (open) fetchStatus();
  }, [open]);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  return (
    <>
      {/* Trigger Button */}
      <button
        className="px-6 py-2 rounded-lg bg-[#F4B30C] text-black font-semibold"
        onClick={() => setOpen(true)}
      >
        Claim Daily $CLS
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card text-foreground rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-2">Daily Claim</h2>
              {loading ? (
                <p className="text-sm text-gray-500">
                  Checking your claim status...
                </p>
              ) : claimed ? (
                <p className="text-sm mb-4">
                  You've claimed today's reward. Come back in{" "}
                  <span className="font-medium text-yellow-600">
                    {formatCountdown(countdown)}
                  </span>
                  .
                </p>
              ) : (
                <p className="text-sm mb-4">
                  Claim your daily{" "}
                  <span className="font-bold text-yellow-500">5 $CLS</span>{" "}
                  reward.
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={claiming || !canClaim}
                onClick={handleClaim}
                className={`w-full px-6 py-2 rounded-lg font-semibold transition-colors ${
                  claiming || !canClaim
                    ? "bg-card-box text-gray-700 cursor-not-allowed"
                    : "bg-[#F4B30C] text-black hover:bg-yellow-400"
                }`}
              >
                {claiming ? "Claiming..." : "Claim 5 Daily $CLS"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DailyClaimModal;
