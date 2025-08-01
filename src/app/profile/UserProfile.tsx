"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLinkAccount, useLogout, usePrivy } from "@privy-io/react-auth";

import { useLoader } from "@/hooks/useLoader";
import { logger } from "@/lib/logger";

import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  EyeOff,
  Coins,
  XCircle,
} from "lucide-react";
import { siDiscord, siX } from "simple-icons";

import { EmailCard } from "@/components/Common/EmailCard";
import { SocialCard } from "@/components/Common/SocialCard";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AvatarUploader from "@/components/Common/AvatarUploader";
import { updateAvatar } from "@/lib/helpers/update-avatar";
import EditableUsername from "@/components/Common/EditableUsername";
import InviteLinkButton from "@/components/Common/InviteLink";
import DailyClaimModal from "@/components/Common/DailyClaimModal";
import ClaimCard from "@/components/Common/ClaimCard";

interface PendingClaim {
  id: string;
  task: string;
  amount: string;
  platform: string;
  canClaim: boolean;
  isClaimed: boolean;
  status: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  twitterHandle: string;
  discordHandle: string;
  email: string;
  inviteLink: string;
  balance: string;
  pendingClaims: PendingClaim[];
}

const Icon = ({ icon }: { icon: { svg: string; hex: string } }) => {
  return (
    <span
      className="w-5 h-5"
      style={{ display: "inline-block", color: `#${icon.hex}` }}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
};

const UserProfile = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { user: privyUser } = usePrivy();

  const { showLoader, hideLoader, LoaderModal } = useLoader();
  const router = useRouter();
  const { logout } = useLogout({
    onSuccess() {
      router.push("/auth/signin");
    },
  });

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/user/profile");

      if (!res.ok) throw new Error("Failed to refresh user");

      const { data } = await res.json();
      setUser(data);
    } catch (err) {
      logger.error("Refresh failed:", err);
    }
  };

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchUserProfile = async () => {
      showLoader({ message: "Loading your profile..." });

      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const { data } = await res.json();
        setUser(data);
        toast({ title: "Profile loaded successfully!", variant: "success" });
      } catch (error) {
        logger.error("Error fetching user profile:", error);
        toast({ title: "Failed to load profile", variant: "error" });
      } finally {
        hideLoader();
      }
    };

    fetchUserProfile();
  }, []);

  const { linkDiscord, linkTwitter, linkEmail } = useLinkAccount({
    onSuccess: async ({ linkMethod }: { linkMethod: string }) => {
      toast({
        title: `${linkMethod} linked successfully!`,
        variant: "success",
      });
      await fetch("/api/user/verify", { method: "PATCH" });
      await refreshUser();
    },
    onError: (error, details) => {
      toast({
        title: `Failed to link ${details.linkMethod}`,
        variant: "destructive",
      });
      logger.log("Failed to link:", error);
    },
  });

  const linkSocial = (platform: string) => {
    switch (platform) {
      case "twitter":
        linkTwitter();
        break;
      case "discord":
        linkDiscord();
      default:
        break;
    }
  };

  const handleClaimReward = async (taskId: string) => {
    try {
      const res = await fetch("/api/tasks/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to claim reward");
      }

      toast({ title: "Reward claimed!", variant: "success" });

      refreshUser();
    } catch (err: any) {
      toast({
        title: err.message || "Failed to claim reward",
        variant: "error",
      });
    }
  };

  if (!user) return <LoaderModal />;

  return (
    <div className="min-h-screen bg-background text-white p-4 lg:p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full py-4 min-h-screen">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-card rounded-md p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <p>User Profile</p>
            </div>
            <Button
              className="bg-card-box hover:bg-card text-foreground font-medium border border-border rounded-md px-4 py-2"
              onClick={() => router.push("/tasks")}
            >
              <Coins className="w-4 h-4 mr-2 text-yellow-500" />
              Earn $CLS
            </Button>
          </motion.div>

          {/* User Details */}
          <div className="grid lg:grid-cols-[minmax(425px,_1fr)_425px] gap-8 grid-cols-1">
            <motion.div
              className="border border-border p-4 sm:p-8 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between flex-wrap gap-4">
                <div className="flex gap-6 flex-col md:items-start items-center">
                  <AvatarUploader
                    currentAvatar={user.avatar}
                    username={user.username}
                    onUploadComplete={async (url) => {
                      await updateAvatar(user.id, url, user.avatar);
                      refreshUser();
                    }}
                  />
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                    <EditableUsername
                      initialName={user.username}
                      userId={user.id}
                    />
                    <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-md">
                      {user.verified ? (
                        <>
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                          <span className="text-white text-sm font-medium">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-white text-sm font-medium">
                            Not Verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <InviteLinkButton inviteLink={user.inviteLink} />
              </div>

              <hr className="border-border my-8" />

              {/* Socials */}
              <div className="mb-8">
                <p className="text-lg mb-2">Social Media Accounts</p>
                <div className="flex gap-6 flex-col md:flex-row lg:flex-col xl:flex-row">
                  <SocialCard
                    icon={<Icon icon={siX} />}
                    platform="Twitter"
                    linked={!!privyUser?.twitter}
                    handle={privyUser?.twitter?.username}
                    action={linkSocial}
                  />

                  <SocialCard
                    icon={<Icon icon={siDiscord} />}
                    platform="Discord"
                    linked={!!privyUser?.discord}
                    handle={privyUser?.discord?.username?.replace(/#\d+$/, "")}
                    action={linkSocial}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-8">
                <p className="text-lg mb-1">Email Address</p>
                <span className="text-[#787878] text-xs mb-2 block">
                  Link your Email to get latest updates on Creatorslab
                </span>
                <div className="flex gap-6">
                  <EmailCard email={user.email} action={() => linkEmail()} />
                </div>
              </div>
            </motion.div>

            {/* Wallet & Tasks */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative bg-card-box border border-border rounded-md overflow-hidden">
                <Image
                  src="/images/walletcard.svg"
                  alt="wallet"
                  width={425}
                  height={220}
                  className="w-[425px] h-[220px] object-cover"
                />
                <div className="absolute top-0 p-5 sm:p-8">
                  <span className="text-gray-500">Wallet Balance</span>
                  <p className="text-4xl flex gap-4 items-center my-4">
                    $CLS{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isBalanceVisible ? "visible" : "hidden"}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isBalanceVisible ? user.balance : "****"}
                      </motion.span>
                    </AnimatePresence>
                    <button onClick={() => setIsBalanceVisible((v) => !v)}>
                      {isBalanceVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </p>

                  <div className="flex gap-2 font-semibold text-base">
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#5d3fd1] to-[#03abff] text-white">
                      Buy $CLS
                    </button>
                    <DailyClaimModal />
                  </div>
                </div>
              </div>
              <div className="border border-border p-6 rounded-xl mt-6 overflow-y-auto max-h-[400px] scrollbar-hide">
                <p className="text-lg mb-2">My Rewards</p>
                <div className="space-y-3">
                  {user.pendingClaims.map((claim, index) => (
                    <ClaimCard
                      key={claim.id}
                      claim={claim}
                      index={index}
                      onClaim={handleClaimReward}
                    />
                  ))}
                  {user.pendingClaims.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No pending claims</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
