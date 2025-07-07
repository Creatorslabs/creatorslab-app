"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function WalletSettingsTab() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 px-6"
    >
      <h3 className="text-sm font-medium text-gray-400">Wallet Settings</h3>

      <div className="space-y-3">
        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white text-sm">
                Export Private Key
              </div>
              <div className="text-xs text-gray-400">
                Backup your wallet securely
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-white hover:bg-card"
            >
              Export
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white text-sm">
                Network Settings
              </div>
              <div className="text-xs text-gray-400">Mainnet • Solana</div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400 border-green-500/30"
            >
              Connected
            </Badge>
          </div>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white text-sm">Auto-refresh</div>
              <div className="text-xs text-gray-400">
                Update balances automatically
              </div>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pt-4">
        Powered by Privy • Secured by Solana
      </div>
    </motion.div>
  );
}
