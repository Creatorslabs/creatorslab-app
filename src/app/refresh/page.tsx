"use client";

import { getAccessToken } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refreshSession = async () => {
      const token = await getAccessToken();
      const redirectUri = searchParams.get("redirect_uri") || "/";

      if (token) {
        router.replace(redirectUri);
      } else {
        router.replace("/login");
      }
    };
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full text-center">
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      <p>Refreshing session...</p>
    </div>
  );
}

export default page;
