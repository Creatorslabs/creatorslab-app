"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step3_RewardsTarget({
  formData,
  handleInputChange,
}: any) {
  const [targetError, setTargetError] = useState("");

  // Validate the URL when target changes
  useEffect(() => {
    if (!formData.target) {
      setTargetError("");
      return;
    }

    try {
      new URL(formData.target);
      setTargetError("");
    } catch {
      setTargetError("Please enter a valid URL.");
    }
  }, [formData.target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          Enter your reward and target information
        </p>
      </div>

      {/* Target URL */}
      <div className="space-y-1">
        <Label htmlFor="target" className="text-gray-300 text-sm">
          Target
        </Label>
        <Input
          id="target"
          placeholder="e.g. https://twitter.com/yourprofile"
          value={formData.target}
          onChange={(e) => handleInputChange("target", e.target.value)}
          className="bg-card-box border-border text-foreground"
        />
        {targetError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-xs mt-1"
          >
            {targetError}
          </motion.p>
        )}
      </div>

      {/* Reward Points */}
      <div className="space-y-2">
        <Label htmlFor="rewardPoints" className="text-gray-300 text-sm">
          Reward Points
        </Label>
        <Input
          id="rewardPoints"
          type="number"
          placeholder="Enter points"
          value={formData.rewardPoints === 0 ? "" : formData.rewardPoints}
          onChange={(e) => {
            const val = e.target.value;
            handleInputChange("rewardPoints", val === "" ? "" : parseInt(val));
          }}
          className="bg-card-box border-border text-foreground input-no-spinner"
        />
      </div>

      {/* Max Participants */}
      <div className="space-y-2">
        <Label htmlFor="maxParticipants" className="text-gray-300 text-sm">
          Max Participants
        </Label>
        <Input
          id="maxParticipants"
          type="number"
          placeholder="Enter maximum participants"
          value={formData.maxParticipants === 0 ? "" : formData.maxParticipants}
          onChange={(e) => {
            const val = e.target.value;
            handleInputChange(
              "maxParticipants",
              val === "" ? "" : parseInt(val)
            );
          }}
          className="bg-card-box border-border text-foreground input-no-spinner"
        />
      </div>
    </motion.div>
  );
}
