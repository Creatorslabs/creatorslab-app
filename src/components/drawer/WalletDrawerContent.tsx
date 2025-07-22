"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
} from "lucide-react";
import WalletCreatePrompt from "./WalletCreatePrompt";
import WalletOverviewTab from "./WalletOverviewTab";
import WalletTransactionsTab from "./WalletTransactionsTab";
import WalletSettingsTab from "./WalletSettingsTab";
import WalletActionFooter from "./WalletActionFooter";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useUserBalances } from "@/hooks/useUserBalances";
import { WalletDisplay } from "./WalletDisplay";

export default function WalletDrawerContent({
  privyUser,
  balances,
  onCreateWallet,
}: {
  privyUser: any;
  balances: { compiled: string; sol: string; usdc: string; cls: string };
  onCreateWallet: () => void;
}) {
  const { refreshBalances } = useUserBalances();
  const walletAddress: string = privyUser?.wallet?.address || "";
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "No wallet connected";

  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "settings"
  >("overview");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshBalances();
    } catch (err) {
      console.error("Failed to refresh balances:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Wallet },
    { id: "transactions", label: "Activity", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Shield },
  ];

  return (
    <AnimatePresence mode="wait">
      {!privyUser?.wallet?.address ? (
        <WalletCreatePrompt onCreateWallet={onCreateWallet} />
      ) : (
        <motion.div
          key="wallet-content"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="space-y-2 flex-1 flex flex-col justify-between"
        >
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                Wallet
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw
                  className={cn("w-4 h-4", isRefreshing && "animate-spin")}
                />
              </Button>
            </div>
          </div>

          <WalletDisplay
            shortAddress={shortAddress}
            fullAddress={walletAddress}
          />

          <div className="px-6">
            <div className="flex bg-background rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-card"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-6">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <WalletOverviewTab
                  walletAddress={walletAddress}
                  shortAddress={shortAddress}
                  balances={balances}
                  isBalanceVisible={isBalanceVisible}
                  setIsBalanceVisible={setIsBalanceVisible}
                  isRefreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              )}

              {activeTab === "transactions" && (
                <WalletTransactionsTab walletAddress={walletAddress} />
              )}

              {activeTab === "settings" && <WalletSettingsTab />}
            </AnimatePresence>
          </div>

          <WalletActionFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
