"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WalletDisplay({
  shortAddress,
  fullAddress,
}: {
  shortAddress: string;
  fullAddress: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="px-6 space-y-6">
      <div className="bg-background rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Wallet Address</span>
          <Badge
            variant="secondary"
            className="bg-green-500/20 text-green-400 border-green-500/30"
          >
            <Shield className="w-3 h-3 mr-1" />
            Secured
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-white">{shortAddress}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyAddress}
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-3 h-3 text-green-400" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy className="w-3 h-3" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <a
            href={`https://solscan.io/account/${fullAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
