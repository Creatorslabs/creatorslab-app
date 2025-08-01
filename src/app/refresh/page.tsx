"use client";

import { useLoader } from "@/hooks/useLoader";
import { logger } from "@/lib/logger";
import { getAccessToken } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";

function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, LoaderModal } = useLoader();

  useEffect(() => {
    showLoader({ message: "Refreshing session..." });

    const fallbackTimeout = setTimeout(() => {
      logger.warn("Fallback triggered — redirecting to /");
      router.replace("/");
    }, 5000);

    const withTimeout = <T,>(promise: Promise<T>, timeout = 4000): Promise<T> =>
      Promise.race([
        promise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ]);

    const refreshSession = async () => {
      try {
        const redirectUri = searchParams.get("redirect_uri") || "/";
        logger.log("Fetching token with timeout...");

        const token = await withTimeout(getAccessToken(), 4000);
        logger.log("Token fetched:", !!token);

        clearTimeout(fallbackTimeout);
        router.replace(token ? redirectUri : "/login");
      } catch (err) {
        logger.error("Token fetch failed:", err);
        clearTimeout(fallbackTimeout);
        router.replace("/");
      }
    };

    refreshSession();

    return () => clearTimeout(fallbackTimeout);
  }, [router, searchParams, showLoader]);

  return <LoaderModal />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshPage />
    </Suspense>
  );
}
