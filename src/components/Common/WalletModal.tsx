"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff,
  Zap,
  Shield,
  RefreshCw,
  Send,
  Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  privyUser: any;
  balances: {
    compiled: string;
    usdc: string;
    sol: string;
    cls: string;
  };
}

interface Transaction {
  id: string;
  type: "send" | "receive" | "earn";
  amount: string;
  currency: string;
  timestamp: Date;
  description: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "earn",
    amount: "0.5",
    currency: "CLS",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    description: "Task completion reward"
  },
  {
    id: "2",
    type: "receive",
    amount: "2.1",
    currency: "SOL",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: "Received from wallet"
  },
  {
    id: "3",
    type: "send",
    amount: "10.0",
    currency: "USDC",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: "Sent to external wallet"
  }
];

export default function WalletModal({ 
  isOpen, 
  onClose, 
  privyUser, 
  balances 
}: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "settings">("overview");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const walletAddress = privyUser?.wallet?.address;
  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "No wallet connected";

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
        variant: "success"
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast({
      title: "Balances updated",
      description: "Your wallet balances have been refreshed",
      variant: "success"
    });
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

  const getTransactionIcon = (type: string) => {
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

  const tabs = [
    { id: "overview", label: "Overview", icon: Wallet },
    { id: "transactions", label: "Activity", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Shield }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-box border-border text-foreground max-w-md w-full max-h-[90vh] overflow-hidden p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                Wallet
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </DialogHeader>

          {/* Tabs */}
          <div className="px-6 pb-4">
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

          {/* Content */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Wallet Address */}
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Wallet Address</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Secured
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-white">{shortAddress}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyAddress}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

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
                        {isBalanceVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
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
                    
                    {[
                      { symbol: "SOL", name: "Solana", balance: balances.sol, color: "from-purple-500 to-pink-500", icon: "◎" },
                      { symbol: "USDC", name: "USD Coin", balance: balances.usdc, color: "from-blue-500 to-cyan-500", icon: "$" },
                      { symbol: "CLS", name: "CreatorsLab", balance: balances.cls, color: "from-yellow-500 to-orange-500", icon: "⚡" }
                    ].map((token) => (
                      <motion.div
                        key={token.symbol}
                        whileHover={{ scale: 1.02 }}
                        className="bg-background rounded-lg p-3 border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-sm font-bold", token.color)}>
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
                              {isBalanceVisible ? `$${(parseFloat(token.balance) * 1.2).toFixed(2)}` : "****"}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-primary hover:bg-primary/80 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" className="border-border text-white hover:bg-card">
                      <Download className="w-4 h-4 mr-2" />
                      Receive
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === "transactions" && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-400">Recent Activity</h3>
                  
                  <div className="space-y-3">
                    {mockTransactions.map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-background rounded-lg p-3 border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center">
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">{tx.description}</div>
                              <div className="text-xs text-gray-400">{formatTime(tx.timestamp)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "font-medium text-sm",
                              tx.type === "send" ? "text-red-400" : "text-green-400"
                            )}>
                              {tx.type === "send" ? "-" : "+"}{tx.amount} {tx.currency}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full border-border text-white hover:bg-card">
                    View All Transactions
                  </Button>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-400">Wallet Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white text-sm">Export Private Key</div>
                          <div className="text-xs text-gray-400">Backup your wallet securely</div>
                        </div>
                        <Button variant="outline" size="sm" className="border-border text-white hover:bg-card">
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white text-sm">Network Settings</div>
                          <div className="text-xs text-gray-400">Mainnet • Solana</div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Connected
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white text-sm">Auto-refresh</div>
                          <div className="text-xs text-gray-400">Update balances automatically</div>
                        </div>
                        <div className="w-10 h-6 bg-primary rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  <div className="text-center text-xs text-gray-400">
                    Powered by Privy • Secured by Solana
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}