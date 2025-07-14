"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  type: string;
  amount: string;
  currency: string;
  timestamp: string;
  description: string;
};

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

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const loadTransactions = async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursor, limit: 10 }),
      });
      const data = await res.json();
      setTransactions((prev) => [...prev, ...data.transactions]);
      setCursor(data.pagination.nextCursor);
      setHasNext(data.pagination.hasNextPage);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasNext &&
        !loading
      ) {
        loadTransactions();
      }
    };
    const node = containerRef.current;
    node?.addEventListener("scroll", handleScroll);
    return () => node?.removeEventListener("scroll", handleScroll);
  }, [hasNext, loading]);

  return (
    <div
      className="space-y-4 px-6 h-[calc(100vh-120px)] overflow-y-auto"
      ref={containerRef}
    >
      <h3 className="text-sm font-medium text-gray-400">Recent Activity</h3>
      <div className="space-y-3">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
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

      {/* Mobile Fallback: Load More Button */}
      {isMobile && hasNext && (
        <Button
          onClick={loadTransactions}
          disabled={loading}
          variant="outline"
          className="w-full border-border text-white hover:bg-card"
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}

      {!hasNext && transactions.length > 0 && (
        <p className="text-center text-xs text-gray-500 pb-4">
          No more transactions
        </p>
      )}
    </div>
  );
}
