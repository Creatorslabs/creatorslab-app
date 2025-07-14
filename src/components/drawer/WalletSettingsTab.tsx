"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaConnection } from "@/hooks/useSolanaConnection";
import PrivateKeyModal from "./PrivateKeyModal";
import { useUserBalances } from "@/hooks/useUserBalances";

export default function WalletSettingsTab() {
  const { user, ready, authenticated, exportWallet } = usePrivy();
  const { network, setNetwork } = useSolanaConnection("devnet");
  const { refreshBalances } = useUserBalances();

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportedKey, setExportedKey] = useState("");

  const isAuthenticated = ready && authenticated;
  const hasEmbeddedWallet = !!user?.linkedAccounts?.find(
    (account: any) =>
      account.type === "wallet" &&
      account.walletClient === "privy" &&
      account.chainType === "solana"
  );

  const handleExport = async () => {
    if (!isAuthenticated || !hasEmbeddedWallet) return;
    try {
      setExporting(true);
      const privateKey = await exportWallet();
      setExportedKey(privateKey);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshBalances();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshBalances]);

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
              onClick={handleExport}
              disabled={!isAuthenticated || !hasEmbeddedWallet || exporting}
              className="border-border text-white hover:bg-card"
            >
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white text-sm">
                Network Settings
              </div>
              <div className="text-xs text-gray-400">
                {network === "mainnet" ? "Mainnet • Solana" : "Devnet • Solana"}
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`${
                ready
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {ready ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNetwork("devnet")}
              className={`text-xs ${
                network === "devnet" ? "text-primary font-bold" : "text-white"
              }`}
            >
              Switch to Devnet
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNetwork("mainnet-beta")}
              className={`text-xs ${
                network === "mainnet-beta"
                  ? "text-primary font-bold"
                  : "text-white"
              }`}
            >
              Switch to Mainnet-beta
            </Button>
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
            <button
              onClick={() => setAutoRefresh((prev) => !prev)}
              className={`w-10 h-6 rounded-full relative transition-colors ${
                autoRefresh ? "bg-primary" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  autoRefresh ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <PrivateKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        privateKey={exportedKey}
      />
    </motion.div>
  );
}
