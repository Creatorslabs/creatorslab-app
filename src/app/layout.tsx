import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Creatorslab",
  description:
    "Join the movement to enable creators worldwide to grow, engage, and earn. Built on the lightning-fast, low-fee Solana blockchain, backed by Solana Foundation and SuperteamNG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen">
        <Providers>
          <AppShell>
            {children}
          </AppShell>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
