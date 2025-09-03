"use client";

import { useLoader } from "@/hooks/useLoader";
import { logger } from "@/lib/logger";
import { getAccessToken } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, Suspense } from "react";

function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, LoaderModal } = useLoader();

  const redirected = useRef(false); // prevent multiple redirects

  useEffect(() => {
    showLoader({ message: "Refreshing session..." });

    const redirectOnce = (url: string) => {
      if (redirected.current) return;
      redirected.current = true;
      router.replace(url);
    };

    const fallbackTimeout = setTimeout(() => {
      logger.warn("Fallback triggered, redirecting to /");
      redirectOnce("/");
    }, 5000);

    const withTimeout = async <T,>(
      promise: Promise<T>,
      timeout = 4000
    ): Promise<T | null> => {
      let timer: NodeJS.Timeout;
      return Promise.race([
        promise,
        new Promise<null>((resolve) => {
          timer = setTimeout(() => resolve(null), timeout);
        }),
      ]).finally(() => clearTimeout(timer));
    };

    const refreshSession = async () => {
      try {
        const redirectUri = searchParams.get("redirect_uri") || "/";
        logger.log("Fetching token with timeout...");

        const token = await withTimeout(getAccessToken(), 4000);
        logger.log("Token fetched:", !!token);

        clearTimeout(fallbackTimeout);
        redirectOnce(token ? redirectUri : "/login");
      } catch (err) {
        logger.error("Token fetch failed:", err);
        clearTimeout(fallbackTimeout);
        redirectOnce("/");
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
