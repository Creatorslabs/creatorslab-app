"use client";
import { motion } from "framer-motion";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface LoaderOptions {
  message?: string;
}

export function useLoader() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Please wait...");

  const showLoader = (options?: LoaderOptions) => {
    setMessage(options?.message || "Please wait...");
    setIsOpen(true);
  };

  const hideLoader = () => {
    setIsOpen(false);
  };

  const LoaderModal = () => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-6 bg-card-box text-foreground rounded-lg shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="text-base text-muted-foreground">{message}</p>
      </div>
    </div>
    );
  };

  return { showLoader, hideLoader, LoaderModal };
}
