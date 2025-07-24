"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  useConnectOrCreateWallet,
  useCreateWallet,
  useLogout,
  usePrivy,
} from "@privy-io/react-auth";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import UserDropdown from "./UserDropdown";
import { MultiStepTaskModal } from "../creator/task-modal/MultiStepTaskModal";
import WalletSidebar from "./WalletSidebar";
import { useUserBalances } from "@/hooks/useUserBalances";
import { toast } from "@/hooks/use-toast";

function NavbarComp() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, user: privyUser } = usePrivy();

  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { balances } = useUserBalances();

  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [isOpen, setIsOpen] = useState(false);

  const { linkWallet } = usePrivy();
  const { logout } = useLogout({
    onSuccess: () => router.push("/auth/signin"),
  });

  const connectWallet = () => {
    try {
      linkWallet({
        walletChainType: "solana-only",
        walletList: [
          "phantom",
          "backpack",
          "detected_solana_wallets",
          "solflare",
          "wallet_connect",
        ],
        description: "Coonect your solana wallet",
      });

      fetch("/api/save-wallet", {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Wallet linking failed:", error);
      toast({
        title: "Wallet Error",
        description: (error as Error).message || "Failed to link wallet.",
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const newParams = new URLSearchParams(window.location.search);
      if (search) {
        newParams.set("search", search);
      } else {
        newParams.delete("search");
      }
      router.replace(`${pathname}?${newParams.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, pathname, router]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearch(currentSearch);
  }, [searchParams]);

  useEffect(() => {
    const fetchUser = async () => {
      if (ready && authenticated) {
        try {
          const res = await fetch("/api/user/me");
          const data = await res.json();
          if (data.success) {
            setUser({
              name: data.data.username || "User",
              email: data.data.email || "no-email@example.com",
              avatar: data.data.image,
              role: data.data.role,
            });
          } else {
            console.warn("User fetch error:", data);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [ready, authenticated]);

  if (pathname.startsWith("/auth")) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-[#1C1C1C] flex items-center justify-between p-4 lg:p-6 border-b border-[#3F3F3F]"
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          width={25}
          height={25}
          alt="Creatorlab logo"
        />
        <span className="hidden md:block text-lg lg:text-xl font-bold text-white">
          creatorslab
        </span>
      </Link>

      <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, quests, creators"
            className="w-full bg-[#212121] border border-[#3F3F3F] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 lg:gap-4">
        {!authenticated ? (
          <Button
            variant="ghost"
            onClick={() => router.push("/auth/signin")}
            className="text-xs lg:text-sm text-gray-300 px-4 hover:bg-card"
          >
            Sign in
          </Button>
        ) : (
          <>
            {user?.role === "creator" && (
              <>
                <Button
                  className="text-xs lg:text-sm text-foreground px-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                  onClick={() => setIsOpen(true)}
                >
                  Plant Seeds
                </Button>

                <MultiStepTaskModal isOpen={isOpen} onClose={closeModal} />
              </>
            )}

            <WalletSidebar
              privyUser={privyUser}
              balances={balances}
              onCreateWallet={connectWallet}
            />

            {loading ? (
              <Skeleton className="w-6 h-6 lg:w-8 lg:h-8 rounded-full" />
            ) : (
              <UserDropdown user={user} onLogOut={logout} />
            )}
          </>
        )}
      </div>
    </motion.header>
  );
}

function Navbar() {
  return (
    <Suspense fallback={<Skeleton className="h-16 w-full" />}>
      <NavbarComp />
    </Suspense>
  );
}

export default Navbar;
