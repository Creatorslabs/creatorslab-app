// WalletSidebar.tsx
"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImportWalletModal from "./ImportWalletModal";
import { Wallet, Wallet2 } from "lucide-react";

export default function WalletSidebar({
  privyUser,
  balances,
  onCreateWallet,
}: {
  privyUser: any;
  balances: {
    compiled: string;
    sol: string;
    usdc: string;
    cls: string;
  };
  onCreateWallet: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showImportWallet, setShowImportWallet] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-wallet-sidebar", handler);
    return () => window.removeEventListener("open-wallet-sidebar", handler);
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        {!privyUser?.wallet?.address ? (
          <>
            <Button
              variant="ghost"
              className="text-xs lg:text-sm text-gray-400 px-2 hover:bg-card"
              onClick={() => setShowImportWallet(true)}
            >
              Import Wallet
            </Button>
            <ImportWalletModal
              isOpen={showImportWallet}
              onClose={() => setShowImportWallet(false)}
            />
          </>
        ) : (
          <Button
            variant="ghost"
            className="text-xs lg:text-sm text-gray-400 px-2"
            onClick={() => setIsOpen(true)}
          >
            {privyUser.wallet.address.slice(0, 6)}...
            {privyUser.wallet.address.slice(-4)}
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="bg-card-box w-full max-w-sm h-screen ml-auto p-6 space-y-6 flex flex-col">
        <AnimatePresence>
          {!privyUser?.wallet?.address ? (
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
          ) : (
            <motion.div
              key="wallet-balances"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h2 className="text-white text-lg font-semibold">Wallet Address</h2>
                    <p className="text-sm text-muted-foreground break-all">
                      {privyUser.wallet.address}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-base font-medium">Balances</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between bg-muted px-3 py-2 rounded-lg">
                      <span>Total</span>
                      <span>{balances.compiled}</span>
                    </div>
                    <div className="flex justify-between bg-muted px-3 py-2 rounded-lg">
                      <span>SOL</span>
                      <span>{balances.sol}</span>
                    </div>
                    <div className="flex justify-between bg-muted px-3 py-2 rounded-lg">
                      <span>USDC</span>
                      <span>{balances.usdc}</span>
                    </div>
                    <div className="flex justify-between bg-muted px-3 py-2 rounded-lg">
                      <span>CLS</span>
                      <span>{balances.cls}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Powered by Privy Wallet
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
}
