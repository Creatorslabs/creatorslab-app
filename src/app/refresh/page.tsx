"use client";

import { useLoader } from "@/hooks/useLoader";
import { logger } from "@/lib/logger";
import { getAccessToken } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";

function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, LoaderModal, hideLoader } = useLoader();

  const redirected = useRef(false);
  const [tookTooLong, setTookTooLong] = useState(false);

  useEffect(() => {
    showLoader({ message: "Refreshing session..." });

    const redirectOnce = (url: string) => {
      if (redirected.current) return;
      redirected.current = true;
      hideLoader();
      router.replace(url);
    };

    const timeoutScreen = setTimeout(() => {
      logger.warn("Session refresh took too long");
      hideLoader();
      setTookTooLong(true);
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

        clearTimeout(timeoutScreen);
        redirectOnce(token ? redirectUri : "/login");
      } catch (err) {
        logger.error("Token fetch failed:", err);
        clearTimeout(timeoutScreen);
        redirectOnce("/");
      }
    };

    refreshSession();

    return () => clearTimeout(timeoutScreen);
  }, [router, searchParams, showLoader, hideLoader]);

  if (tookTooLong) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 text-center">
        <p className="text-lg text-gray-300">
          This is taking longer than expected.
        </p>
        <div className="flex space-x-4">
          <Button
            onClick={() => router.replace("/")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Go Home
          </Button>
          <Button
            onClick={() => router.replace("/login")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return <LoaderModal />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshPage />
    </Suspense>
  );
}
