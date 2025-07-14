"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function PrivateKeyModal({
  isOpen,
  onClose,
  privateKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  privateKey: string;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      toast({ title: "Private key copied" });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-xl text-white space-y-4">
              <h2 className="text-lg font-semibold">Your Private Key</h2>

              <p className="text-sm text-gray-400">
                ⚠️ Never share this key. Anyone with access can control your
                wallet.
              </p>

              <div className="bg-muted text-sm text-gray-100 p-3 rounded-md break-all border border-border">
                {privateKey}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="text-white"
                >
                  Copy
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
