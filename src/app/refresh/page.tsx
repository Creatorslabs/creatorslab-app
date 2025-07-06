"use client";

import { useLoader } from "@/hooks/useLoader";
import { getAccessToken } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, LoaderModal } = useLoader();

  useEffect(() => {
    showLoader({ message: "Refreshing session..." });

    const refreshSession = async () => {
      const token = await getAccessToken();
      const redirectUri = searchParams.get("redirect_uri") || "/";

      if (token) {
        router.replace(redirectUri);
      } else {
        router.replace("/login");
      }
    };

    refreshSession();
  }, [router, searchParams]);

  return <LoaderModal />;
}

export default page;
