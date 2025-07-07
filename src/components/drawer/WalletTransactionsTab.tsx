"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockTransactions = [
  {
    id: "1",
    type: "earn",
    amount: "0.5",
    currency: "CLS",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    description: "Task completion reward",
  },
  {
    id: "2",
    type: "receive",
    amount: "2.1",
    currency: "SOL",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: "Received from wallet",
  },
  {
    id: "3",
    type: "send",
    amount: "10.0",
    currency: "USDC",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: "Sent to external wallet",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "send":
      return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    case "receive":
      return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
    case "earn":
      return <Zap className="w-4 h-4 text-yellow-400" />;
    default:
      return <TrendingUp className="w-4 h-4 text-blue-400" />;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function WalletTransactionsTab() {
  return (
    <div className="space-y-4 px-6">
      <h3 className="text-sm font-medium text-gray-400">Recent Activity</h3>
      <div className="space-y-3">
        {mockTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background rounded-lg p-3 border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center">
                  {getIcon(tx.type)}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">
                    {tx.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(tx.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "font-medium text-sm",
                    tx.type === "send" ? "text-red-400" : "text-green-400"
                  )}
                >
                  {tx.type === "send" ? "-" : "+"}
                  {tx.amount} {tx.currency}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full border-border text-white hover:bg-card"
      >
        View All Transactions
      </Button>
    </div>
  );
}
