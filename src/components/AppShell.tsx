"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Common/Navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "" : "lg:px-8 relative"}>
        {children}
      </div>
    </>
  );
}
