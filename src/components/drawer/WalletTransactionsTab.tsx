"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSolanaConnection } from "../context/SolanaConnectionContext";
import { formatDistanceToNow } from "date-fns";

type Transaction = {
  id: string;
  type: "send" | "receive" | "TRANSFER" | "unknown" | string;
  amount: string;
  currency: string;
  timestamp: string;
  sender: string;
  receiver: string;
};

const getIcon = (type: string) => {
  const lower = type.toLowerCase();
  if (lower === "send")
    return <ArrowUpRight className="text-red-400 w-4 h-4" />;
  if (lower === "receive")
    return <ArrowDownLeft className="text-green-400 w-4 h-4" />;
  return <TrendingUp className="text-blue-400 w-4 h-4" />;
};

const getSolscanUrl = (network: string, address: string) => {
  const base = "https://solscan.io/account/";
  const suffix =
    network === "devnet"
      ? "?cluster=devnet"
      : network === "testnet"
      ? "?cluster=testnet"
      : "";
  return `${base}${address}${suffix}`;
};

const shortenAddress = (address: string) =>
  address.length > 20
    ? `${address.slice(0, 6)}...${address.slice(-6)}`
    : address;

export default function WalletTransactionsTab({
  walletAddress,
}: {
  walletAddress: string;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { network } = useSolanaConnection();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/transactions?network=${network}`);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    };

    if (network) fetchTransactions();
  }, [network]);

  return (
    <div className="space-y-4 px-6 h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="text-sm font-medium text-gray-400">Recent Activity</h3>

      <div className="space-y-3">
        {loading &&
          Array.from({ length: 4 }, (_, i) => (
            <Skeleton
              key={i}
              className="h-[72px] rounded-lg bg-card border border-border"
            />
          ))}

        {!loading && transactions.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-10">
            No transactions yet
          </div>
        )}

        {!loading &&
          transactions.map((tx, i) => {
            const type = tx.type.toLowerCase();
            const directionLabel =
              type === "receive"
                ? `From: ${shortenAddress(tx.sender)}`
                : type === "send"
                ? `To: ${shortenAddress(tx.receiver)}`
                : `From: ${shortenAddress(tx.sender)}`;

            const isSend = type === "send";
            const isReceive = type === "receive";

            return (
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
                      {getIcon(type)}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm capitalize">
                        {type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(tx.timestamp))} ago
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "font-medium text-sm",
                        isSend
                          ? "text-red-400"
                          : isReceive
                          ? "text-green-400"
                          : "text-gray-300"
                      )}
                    >
                      {isSend ? "-" : "+"}
                      {tx.amount} {tx.currency}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2 pl-11 break-all">
                  {directionLabel}
                </div>
              </motion.div>
            );
          })}
      </div>

      {!loading && transactions.length > 0 && (
        <div className="flex justify-center pt-4">
          <a
            href={getSolscanUrl(network, walletAddress)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" className="text-sm text-primary">
              View More on Solscan
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
