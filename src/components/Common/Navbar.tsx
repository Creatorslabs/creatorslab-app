"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ImportWalletModal from "./ImportWalletModal";
import Image from "next/image";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, user: privyUser } = usePrivy();

  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImportWallet, setShowImportWallet] = useState(false);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

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
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          width={25}
          height={25}
          alt="Creatorlab logo"
        />
        <span className="text-lg lg:text-xl font-bold text-white">
          creatorslab
        </span>
      </Link>

      {/* Search Bar */}
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
            className="text-xs lg:text-sm text-gray-300 px-4"
          >
            Sign in
          </Button>
        ) : (
          <>
            <Button className="text-xs lg:text-sm text-foreground px-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
              Plant Seeds
            </Button>

            {!privyUser?.wallet?.address ? (
              <>
                <Button
                  variant="ghost"
                  className="text-xs lg:text-sm text-gray-400 px-2"
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
                onClick={() => {
                  const openEvent = new CustomEvent("open-wallet-sidebar");
                  window.dispatchEvent(openEvent);
                }}
              >
                {privyUser.wallet.address.slice(0, 6)}...
                {privyUser.wallet.address.slice(-4)}
              </Button>
            )}

            {loading ? (
              <Skeleton className="w-6 h-6 lg:w-8 lg:h-8 rounded-full" />
            ) : (
              <UserDropdown user={user} />
            )}
          </>
        )}
      </div>
    </motion.header>
  );
}
