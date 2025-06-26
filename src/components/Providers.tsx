"use client";

import { useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "dummy-app-id";
const privyClientId = process.env.NEXT_PUBLIC_PRIVY_WEB_CLIENT_ID || "dummy-client-id";
const amplitudeApiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || "dummy-api-key";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize Amplitude if we have a valid API key
    if (amplitudeApiKey && amplitudeApiKey !== "dummy-api-key") {
      amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
      amplitude.init(amplitudeApiKey, {
        fetchRemoteConfig: true,
        autocapture: true,
      });
    }
  }, []);

  // Only render PrivyProvider if we have valid credentials
  if (!privyAppId || privyAppId === "dummy-app-id" || !privyClientId || privyClientId === "dummy-client-id") {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClientId}
      config={{
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}