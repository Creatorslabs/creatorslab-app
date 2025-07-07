"use client";
import { motion } from "framer-motion";
import { Wallet2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletCreatePrompt({
  onCreateWallet,
}: {
  onCreateWallet: () => void;
}) {
  return (
    <motion.div
      key="create-wallet"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="text-center space-y-4 flex-1 flex flex-col justify-center"
    >
      <Wallet2 className="mx-auto w-10 h-10 text-muted-foreground" />
      <p className="text-white text-sm">
        No wallet found. You can create one to start using the platform.
      </p>
      <Button onClick={onCreateWallet} className="w-full">
        Create Wallet
      </Button>
    </motion.div>
  );
}
