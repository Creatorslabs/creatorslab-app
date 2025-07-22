"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ImportWalletModal from "./ImportWalletModal";
import WalletDrawerContent from "../drawer/WalletDrawerContent";

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
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-wallet-sidebar", handler);
    return () => window.removeEventListener("open-wallet-sidebar", handler);
  }, []);

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="text-xs lg:text-sm text-gray-400 px-2 hover:bg-card"
          >
            {!privyUser?.wallet?.address ? (
              <>No Wallet</>
            ) : (
              <>
                {privyUser.wallet.address.slice(0, 6)}...
                {privyUser.wallet.address.slice(-4)}
              </>
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent className="bg-card-box w-full max-w-sm h-screen ml-auto flex flex-col !rounded-none !pt-0 !mt-0 [&>div:first-child]:hidden">
          <WalletDrawerContent
            privyUser={privyUser}
            balances={balances}
            onCreateWallet={onCreateWallet}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
