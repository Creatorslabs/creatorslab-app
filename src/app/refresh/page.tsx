"use client";

import { useLoader } from "@/hooks/useLoader";
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
      router.replace("/");
    }, 10000);

    const refreshSession = async () => {
      try {
        const token = await getAccessToken();
        const redirectUri = searchParams.get("redirect_uri") || "/";

        if (token) {
          clearTimeout(fallbackTimeout);
          router.replace(redirectUri);
        } else {
          clearTimeout(fallbackTimeout);
          router.replace("/login");
        }
      } catch (error) {
        console.error("Session refresh failed:", error);
        clearTimeout(fallbackTimeout);
        router.replace("/");
      }
    };

    refreshSession();

    return () => clearTimeout(fallbackTimeout);
  }, [router, searchParams, showLoader]);

  return <LoaderModal />;
}

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshPage />
    </Suspense>
  );
}

export default page;
