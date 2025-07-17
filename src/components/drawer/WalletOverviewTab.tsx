"use client";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const tokenList = [
    {
      symbol: "SOL",
      name: "Solana",
      balance: balances.sol,
      color: "from-purple-500 to-pink-500",
      icon: "◎",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: balances.usdc,
      color: "from-blue-500 to-cyan-500",
      icon: "$",
    },
    {
      symbol: "CLS",
      name: "CreatorsLab",
      balance: balances.cls,
      color: "from-yellow-500 to-orange-500",
      icon: "⚡",
    },
  ];

  return (
    <div className="space-y-6 px-6">
      {/* Total Balance */}
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
        <div className="text-2xl font-bold text-white mb-1">
          {isBalanceVisible ? `$${balances.compiled}` : "****"}
        </div>
        <div className="flex items-center gap-1 text-sm text-green-400">
          <TrendingUp className="w-3 h-3" />
          +12.5% (24h)
        </div>
      </div>

      {/* Token Balances */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Token Balances</h3>
        {tokenList.map((token) => (
          <div
            key={token.symbol}
            className="bg-background rounded-lg p-3 border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-sm font-bold",
                    token.color
                  )}
                >
                  {token.icon}
                </div>
                <div>
                  <div className="font-medium text-white">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white">
                  {isBalanceVisible ? token.balance : "****"}
                </div>
                <div className="text-xs text-gray-400">
                  {isBalanceVisible
                    ? `$${
                        token.name === "CreatorsLab"
                          ? parseFloat(token.balance) * 0.02
                          : (parseFloat(token.balance) * 0.02).toFixed(2)
                      }`
                    : "****"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
