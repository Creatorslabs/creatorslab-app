"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useLoader } from "@/hooks/useLoader";
import CreatorProfile from "./CreatorProfile";
import UserProfile from "./UserProfile";
import { logger } from "@/lib/logger";

const UnknownRole = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
    <p className="text-lg font-semibold text-gray-300">
      Could not determine your role. Please try again.
    </p>
    <button
      onClick={onRefresh}
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80"
    >
      Refresh
    </button>
  </div>
);

const RetryNotice = ({ seconds }: { seconds: number }) => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md text-sm shadow-lg">
    Retrying in {seconds} second{seconds !== 1 ? "s" : ""}...
  </div>
);

export default function UserProfileWrapper() {
  const { showLoader, hideLoader, LoaderModal } = useLoader();
  const [role, setRole] = useState<"user" | "creator" | null>(null);
  const [unknown, setUnknown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retrySeconds, setRetrySeconds] = useState<number | null>(null);

  const hasFetched = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchUser = useCallback(async (silent = false) => {
    if (!silent) showLoader({ message: "Loading your profile..." });
    setLoading(true);
    setUnknown(false);
    setRetrySeconds(null);

    try {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch user");

      const { data } = await res.json();
      const userRole = data?.role;

      if (userRole === "user" || userRole === "creator") {
        setRole(userRole);
        if (!silent) toast({ title: "Profile loaded", variant: "success" });
        retryCount.current = 0;
      } else {
        setUnknown(true);
      }
    } catch (error) {
      logger.error("Failed to load profile:", error);
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        const delay = 1000 * Math.pow(2, retryCount.current);

        let secondsLeft = delay / 1000;
        setRetrySeconds(secondsLeft);

        retryTimer.current = setInterval(() => {
          secondsLeft--;
          setRetrySeconds(secondsLeft);
          if (secondsLeft <= 0 && retryTimer.current) {
            clearInterval(retryTimer.current);
          }
        }, 1000);

        setTimeout(() => fetchUser(true), delay);
        return;
      }
      toast({ title: "Error loading profile", variant: "destructive" });
      setUnknown(true);
    } finally {
      if (!silent) hideLoader();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUser();
    return () => {
      if (retryTimer.current) clearInterval(retryTimer.current);
    };
  }, [fetchUser]);

  if (loading) return <LoaderModal />;
  if (role === "user") return <UserProfile />;
  if (role === "creator") return <CreatorProfile />;

  return (
    <>
      <UnknownRole onRefresh={() => fetchUser()} />
      {retrySeconds !== null && <RetryNotice seconds={retrySeconds} />}
    </>
  );
}
