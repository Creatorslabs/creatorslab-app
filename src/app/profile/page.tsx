"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useLoader } from "@/hooks/useLoader";
import CreatorProfile from "./CreatorProfile";
import UserProfile from "./UserProfile";

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

export default function UserProfileWrapper() {
  const { showLoader, hideLoader, LoaderModal } = useLoader();
  const [role, setRole] = useState<"user" | "creator" | null>(null);
  const [unknown, setUnknown] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  const fetchUser = async () => {
    showLoader({ message: "Loading your profile..." });
    setLoading(true);
    setUnknown(false);

    try {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch user");

      const { data } = await res.json();
      const userRole = data?.role;

      if (userRole === "user" || userRole === "creator") {
        setRole(userRole);
        toast({ title: "Profile loaded", variant: "success" });
      } else {
        setUnknown(true);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast({ title: "Error loading profile", variant: "destructive" });
      setUnknown(true);
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUser();
  }, []);

  if (loading) return <LoaderModal />;
  if (role === "user") return <UserProfile />;
  if (role === "creator") return <CreatorProfile />;
  return <UnknownRole onRefresh={fetchUser} />;
}
