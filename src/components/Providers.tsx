"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { SolanaConnectionProvider } from "./context/SolanaConnectionContext";
import { TooltipProvider } from "./ui/tooltip";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const privyClietId = process.env.NEXT_PUBLIC_PRIVY_WEB_CLIENT_ID!;

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SolanaConnectionProvider>
        <PrivyProvider
          appId={privyAppId}
          clientId={privyClietId}
          config={{
            appearance: {
              showWalletLoginFirst: true,
              walletList: [
                "detected_solana_wallets",
                "backpack",
                "phantom",
                "solflare",
                "metamask",
              ],
              theme: "dark",
              accentColor: "#5D3FD1",
              landingHeader: "CreatorsLab",
              walletChainType: "solana-only",
              logo: "https://creatorslab.cc/images/logo.png",
            },
            loginMethods: ["email", "discord", "twitter", "wallet"],
            fundingMethodConfig: {
              moonpay: {
                useSandbox: true,
              },
            },
            externalWallets: {
              solana: { connectors: solanaConnectors },
            },
            solanaClusters: [
              {
                name: "mainnet-beta",
                rpcUrl: "https://api.mainnet-beta.solana.com",
              },
            ],
            embeddedWallets: {
              solana: {
                createOnLogin: "users-without-wallets",
              },
            },
          }}
        >
          {children}
        </PrivyProvider>
      </SolanaConnectionProvider>
    </TooltipProvider>
    //Bro coded this
  );
}
