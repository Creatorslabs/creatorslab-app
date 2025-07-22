"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLinkAccount } from "@privy-io/react-auth";
import { toast } from "@/hooks/use-toast";
import { useLoader } from "@/hooks/useLoader";

export default function ConnectAccountPage() {
  const router = useRouter();
  const { showLoader, LoaderModal } = useLoader();

  const { linkDiscord, linkTwitter, linkEmail } = useLinkAccount({
    onSuccess: async ({ linkMethod }: { linkMethod: string }) => {
      toast({
        title: `${linkMethod} linked successfully!`,
        variant: "success",
      });

      await fetch("/api/user/verify", { method: "PATCH" });

      const next = localStorage.getItem("link_next") || "/dashboard";
      localStorage.removeItem("link_platform");
      localStorage.removeItem("link_next");
      router.replace(next);
    },
    onError: (error, details) => {
      toast({
        title: `Failed to link ${details.linkMethod}`,
        description: error || "An error occurred.",
        variant: "destructive",
      });

      const next = localStorage.getItem("link_next") || "/dashboard";
      localStorage.removeItem("link_platform");
      localStorage.removeItem("link_next");
      router.replace(next);
    },
  });

  useEffect(() => {
    showLoader({ message: "Connecting your account..." });
    const platform = localStorage.getItem("link_platform");
    const next = localStorage.getItem("link_next") || "/";

    switch (platform) {
      case "discord":
        linkDiscord();
        break;
      case "twitter":
        linkTwitter();
        break;
      case "email":
        linkEmail();
        break;
      default:
        toast({
          title: "Unsupported platform",
          description: `Unknown platform: ${platform}`,
          variant: "destructive",
        });
        router.replace(next);
    }
  }, []);

  return <LoaderModal />;
}
