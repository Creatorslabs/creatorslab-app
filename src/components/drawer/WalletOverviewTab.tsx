"use client";

import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

export default function WalletOverviewTab({
  balances,
  isBalanceVisible,
  setIsBalanceVisible,
}: {
  walletAddress: string;
  shortAddress: string;
  balances: { compiled: string; sol: string; usdc: string; cls: string };
  isBalanceVisible: boolean;
  setIsBalanceVisible: (v: boolean) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const solPriceInUSD = 157.34;

  const tokenList = useMemo(() => {
    const getRandomTrend = () => (Math.random() * 10 - 5).toFixed(2); // random trend between -5% to +5%

    return [
      {
        symbol: "SOL",
        name: "Solana",
        balance: balances.sol,
        price: (parseFloat(balances.sol) * solPriceInUSD).toFixed(2),
        iconUrl: "/icons/solana.png",
        trend: getRandomTrend(),
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        balance: balances.usdc,
        price: parseFloat(balances.usdc).toFixed(2),
        iconUrl: "/icons/usdc.png",
        trend: getRandomTrend(),
      },
      {
        symbol: "CLS",
        name: "CreatorsLab",
        balance: balances.cls,
        price: (parseFloat(balances.cls) * 0.02).toFixed(2),
        iconUrl: "/icons/cls.png",
        trend: getRandomTrend(),
      },
    ];
  }, [balances]);

  return (
    <div className="space-y-6 px-6">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4 border border-primary/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Total Portfolio Value</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="h-6 w-6 text-gray-400 hover:text-white"
          >
            {isBalanceVisible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isBalanceVisible ? "balance" : "hidden"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-white mb-1"
          >
            {isBalanceVisible ? `$${balances.compiled}` : "****"}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-1 text-sm text-green-400">
          <TrendingUp className="w-3 h-3" />
          +12.5% (24h)
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Token Balances</h3>
        {tokenList.map((token) => (
          <div
            key={token.symbol}
            className="bg-background rounded-lg p-3 border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  <Image
                    src={token.iconUrl}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="object-contain"
                    quality={75}
                    loader={({ src, width, quality }) =>
                      `${src}?w=${width}&q=${quality || 75}`
                    }
                  />
                </div>
                <div>
                  <div className="font-medium text-white">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isBalanceVisible ? token.balance : "hidden"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="font-medium text-white"
                  >
                    {isBalanceVisible ? token.balance : "****"}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isBalanceVisible ? token.price : "hidden-price"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-gray-400"
                  >
                    {isBalanceVisible ? `$${token.price}` : "****"}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              {parseFloat(token.trend) > 0 ? "+" : ""}
              {token.trend}% (24h)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
