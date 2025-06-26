"use client";

import { useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const privyClietId = process.env.NEXT_PUBLIC_PRIVY_WEB_CLIENT_ID!;
const amplitudeApiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!;

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
    amplitude.init(amplitudeApiKey, {
      fetchRemoteConfig: true,
      autocapture: true,
    });
  }, []);

  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClietId}
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
