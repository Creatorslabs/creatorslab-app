"use client";

import { useEffect, useState } from "react";

import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import CreatorProfile from "./CreatorProfile";

const UnknownRole = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
    <p className="text-lg font-semibold text-gray-300">
      Could not determine user role. Please try again.
    </p>
    <button
      onClick={onRefresh}
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80"
    >
      Refresh
    </button>
  </div>
);

export default function UserProfile() {
  const { showLoader, hideLoader, LoaderModal } = useLoader();
  const [role, setRole] = useState<"user" | "creator" | null>(null);
  const [unknown, setUnknown] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    showLoader({ message: "Loading your profile..." });

    try {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch user");

      const { data } = await res.json();

      if (data?.role === "user" || data?.role === "creator") {
        setRole(data.role);
      } else {
        setUnknown(true);
      }

      toast({ title: "Profile loaded successfully!", variant: "success" });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({ title: "Failed to load profile", variant: "error" });
      setUnknown(true);
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <LoaderModal />;

  if (role === "user") return <UserProfile />;
  if (role === "creator") return <CreatorProfile />;
  return <UnknownRole onRefresh={fetchUser} />;
}
