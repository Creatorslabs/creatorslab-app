"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CirclePlus,
  Copy,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLoader } from "@/hooks/useLoader";
import Image from "next/image";
import { SocialCard } from "@/components/Common/SocialCard";
import { useLinkAccount, usePrivy } from "@privy-io/react-auth";
import { siDiscord, siX } from "simple-icons";
import { EmailCard } from "@/components/Common/EmailCard";
import { MultiStepTaskModal } from "@/components/creator/task-modal/MultiStepTaskModal";
import AvatarUploader from "@/components/Common/AvatarUploader";
import { updateAvatar } from "@/lib/helpers/update-avatar";
import EditableUsername from "@/components/Common/EditableUsername";
import { logger } from "@/lib/logger";
import DailyClaimModal from "@/components/Common/DailyClaimModal";

interface Creator {
  id: string;
  email: string;
  balance: string;
  username: string;
  avatar: string;
  verified: boolean;
  inviteLink: string;
}

const Icon = ({ icon }: { icon: { svg: string; hex: string } }) => {
  const whiteSVG = icon.svg
    .replace(/<svg /, '<svg fill="currentColor" ')
    .replace(/fill="[^"]*"/g, 'fill="currentColor"');

  return (
    <span
      className="w-5 h-5 text-white"
      dangerouslySetInnerHTML={{ __html: whiteSVG }}
    />
  );
};

export default function CreatorProfile({
  creator,
  refreshProfile,
}: {
  creator: Creator;
  refreshProfile: () => Promise<void>;
}) {
  const router = useRouter();
  const { user: privyUser } = usePrivy();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { LoaderModal } = useLoader();

  const { linkDiscord, linkTwitter, linkEmail } = useLinkAccount({
    onSuccess: async ({ linkMethod }: { linkMethod: string }) => {
      toast({
        title: `${linkMethod} linked successfully!`,
        variant: "success",
      });
      await fetch("/api/user/verify", { method: "PATCH" });
      await refreshProfile();
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
        break;
    }
  };

  const handleCopyInviteLink = () => {
    if (creator.inviteLink) {
      navigator.clipboard.writeText(creator.inviteLink);
      toast({
        title: "Invite link copied!",
        description: "The invite link has been copied to your clipboard.",
        variant: "success",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              className="text-gray-400 hover:text-white hover:bg-card"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Creator profile</h1>
          </div>
          <Button
            className="bg-card-box hover:bg-card text-foreground font-medium border border-border rounded-md px-4 py-2"
            onClick={() => setIsOpen(true)}
          >
            <CirclePlus className="w-4 h-4 mr-2 text-yellow-500" />
            Create Task
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "linear-gradient(35deg, #0F0529 0%, #016495 27%, #25205C 46%)"
                    : "linear-gradient(90deg, #0F0529 0%, #016495 27%, #25205C 46%, #A3452A 63%, #017AA6 83%, #333397 100%)",
              }}
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 text-center md:text-left">
                  <AvatarUploader
                    currentAvatar={creator.avatar}
                    username={creator.username}
                    onUploadComplete={async (url) => {
                      await updateAvatar(creator.id, url, creator.avatar);
                      refreshProfile();
                    }}
                  />

                  <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex items-center gap-2">
                      <EditableUsername
                        initialName={creator.username}
                        userId={creator.id}
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-card/30 px-3 py-1 rounded-md border border-white/50">
                      {creator.verified ? (
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

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="flex items-center gap-2 border border-white/50 px-3 py-1 rounded-lg">
                        <Icon icon={siX} />
                        <span className="text-white text-sm">
                          {privyUser?.twitter?.username || "Not Linked"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 border border-white/50 px-3 py-1 rounded-lg">
                        <Icon icon={siDiscord} />
                        <span className="text-white text-sm">
                          {privyUser?.discord?.username?.replace(/#\d+$/, "") ||
                            "Not Linked"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCopyInviteLink}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                >
                  <span>Invite Link</span>
                  <Copy className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Wallet & Social Accounts */}
          <div className="space-y-6">
            {/* Wallet Balance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-[#F7F8F9] dark:bg-[#101214] dark:text-white rounded-md overflow-hidden w-fit"
            >
              <Image
                src="/images/walletcard.svg"
                alt="walletcard"
                width={425}
                height={220}
                className="w-[425px] sm:h-[220px]"
              />
              <div className="absolute top-0 p-5 sm:p-8">
                <span className="text-[#606060]">Wallet Balance</span>

                <p className="text-xl sm:text-4xl flex gap-8 items-center my-3 sm:mt-3 sm:mb-6">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isBalanceVisible ? "visible" : "hidden"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      $CLS {isBalanceVisible ? creator.balance : "****"}
                    </motion.span>
                  </AnimatePresence>
                  <button
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  >
                    {isBalanceVisible ? (
                      <EyeOff className="w-4 h-4 " />
                    ) : (
                      <Eye className="w-4 h-4 " />
                    )}
                  </button>
                </p>

                <div className="flex gap-2 font-semibold text-base">
                  <button className="p-2 sm:px-6 sm:py-2 rounded-lg bg-gradient-to-r from-[#5d3fd1] to-[#03abff]">
                    Buy $CLS
                  </button>

                  <DailyClaimModal />
                </div>
              </div>
            </motion.div>

            {/* Social Media Accounts */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h4 className="text-lg font-semibold mb-4">
                Social Media Accounts
              </h4>
              <div className="space-y-3">
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
            </motion.div>

            {/* Email Address */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold mb-2">Email Address</h4>
              <p className="text-sm text-gray-400 mb-4">
                Link your Email to get latest updates on Creatorslab
              </p>
              <EmailCard email={creator.email} action={() => linkEmail()} />
            </motion.div>
          </div>
        </div>
      </div>

      <MultiStepTaskModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <LoaderModal />
    </div>
  );
}
