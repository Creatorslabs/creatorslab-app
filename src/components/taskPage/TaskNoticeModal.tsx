"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { logger } from "@/lib/logger";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export default function TaskNoticeModal({
  isOpen,
  onClose,
  handleSubmit,
  isSubmitting,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card-box border border-border rounded-2xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Submit Task
              </h3>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 text-sm font-medium mb-2">
                  Please note
                </p>
                <p className="text-gray-300 text-sm">
                  Reversing a reaction costs <strong>$2</strong> or{" "}
                  <strong>50 CLS</strong> if flagged by the system or reported
                  by users. Failure to pay within 7 days may lead to an account
                  ban and restrictions on linked social accounts
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-3 mb-4"
              >
                {isSubmitting ? "Submitting task...." : "Submit"}
              </Button>

              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
