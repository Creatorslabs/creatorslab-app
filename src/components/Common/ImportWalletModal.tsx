"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useImportWallet } from "@privy-io/react-auth/solana";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportWalletModal({ isOpen, onClose }: Props) {
  const { ready, authenticated } = usePrivy();
  const { importWallet } = useImportWallet();
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!authenticated || !privateKey) return;
    try {
      setLoading(true);
      const wallet = await importWallet({ privateKey });
      toast({
        title: "Wallet Imported",
        description: "Your wallet has been successfully imported.",
        variant: "success",
      });
      onClose();
    } catch (error) {
      logger.error("Failed to import wallet:", error);
      toast({
        title: "Import Failed",
        description:
          "There was an error importing your wallet. Please check your private key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card-box p-6 rounded-2xl max-w-md w-full shadow-xl border border-border"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Import Your Wallet
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Paste your private key below to import your wallet. Keep this
              secure.
            </p>
            <input
              type="text"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Private key"
              className="w-full bg-card-box border border-border rounded-md px-4 py-2 text-foreground text-sm mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!authenticated || loading || !privateKey || !ready}
              >
                {loading ? "Importing..." : "Import Wallet"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// upuKdM9MW6dDMoMT3Ahi5XjJQqoUCjQqUgHnk2VQZaceCfE3H1sfaSXBvGtWSvP4hLLkRSETVMnAxo4ViXDpys8
