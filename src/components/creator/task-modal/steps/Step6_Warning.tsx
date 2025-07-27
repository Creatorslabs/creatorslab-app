"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Step6_Warning() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="max-w-md w-full relative"
      >
        <div className="text-center">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm font-medium mb-2">
              Please note
            </p>
            <p className="text-gray-300 text-sm">
              Reversing a reaction costs <strong>$2</strong> or{" "}
              <strong>50 CLS</strong> if flagged by the system or reported by
              users. Failure to pay within 7 days may lead to an account ban and
              restrictions on linked social accounts
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
