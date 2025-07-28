"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Share2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SimpleIcon } from "../Common/SimpleIcon";
import { logger } from "@/lib/logger";

interface ShareButtonProps {
  taskId: string;
  taskLink: string;
}

export default function ShareButton({ taskId, taskLink }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const encodedLink = encodeURIComponent(taskLink);
  const shareText = encodeURIComponent("Check out this task on CreatorsLab!");

  const socialPlatforms = [
    {
      name: "twitter",
      url: `https://twitter.com/intent/tweet?url=${encodedLink}&text=${shareText}`,
    },
    {
      name: "facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
    },
    {
      name: "whatsapp",
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodedLink}`,
    },
    {
      name: "telegram",
      url: `https://t.me/share/url?url=${encodedLink}&text=${shareText}`,
    },
  ];

  const copyToClipboard = async () => {
    navigator.clipboard.writeText(taskLink);
    setCopied(true);
    toast({ title: "Link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
    sendReport("clipboard");
  };

  const handleShare = async (platform: string, link: string) => {
    try {
      setIsSharing(true);
      window.open(link, "_blank");

      sendReport(platform);
    } catch (error) {
      logger.warn("Failed to share task:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const sendReport = (platform: string) => {
    try {
      fetch(`/api/tasks/${taskId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      toast({
        title: "Failed to share task",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-card text-white hover:bg-card/80 transition-all duration-200`}
      >
        <Share2 className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-card-box border border-border rounded-2xl p-6 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" /> Share this Task
                </h3>

                <div className="flex items-center gap-2 mb-6">
                  <input
                    readOnly
                    value={taskLink}
                    className="flex-1 text-sm rounded-lg border border-border bg-card px-3 py-2 text-white outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-secondary rounded-lg text-black hover:bg-yellow-400 transition"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex justify-center gap-6 flex-wrap">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => handleShare(platform.name, platform.url)}
                      disabled={isSharing}
                      className="flex flex-col items-center gap-1 text-white text-sm hover:text-secondary transition disabled:opacity-50"
                    >
                      <SimpleIcon
                        platform={platform.name}
                        className="w-6 h-6 text-white"
                      />
                      <span className="capitalize">{platform.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 text-gray-400 hover:text-white w-full text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
