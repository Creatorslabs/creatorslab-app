"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useLoader } from "@/hooks/useLoader";
import CreatorProfile from "./CreatorProfile";
import UserProfile from "./UserProfile";
import { logger } from "@/lib/logger";

type UserRole = "user" | "creator";

interface UserResponse {
  data?: {
    role?: UserRole;
  };
}

async function fetchUser(): Promise<UserResponse> {
  const res = await fetch("/api/user/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export default function UserProfileWrapper() {
  const { LoaderModal, showLoader, hideLoader } = useLoader();

  const { data, isLoading, isError, error } = useQuery<UserResponse>({
    queryKey: ["user-profile"],
    queryFn: fetchUser,
    retry: 1,
    staleTime: 1000 * 60,
  });

  // Handle side effects separately
  useEffect(() => {
    if (isLoading) {
      showLoader({ message: "Loading your profile..." });
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (error) {
      logger.error("Failed to load profile:", error);
      toast({
        title: "Error loading profile",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error]);

  if (isLoading) return <LoaderModal />;
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Could not load your profile.
      </div>
    );
  }

  const role = data?.data?.role ?? null;

  if (role === "creator") return <CreatorProfile />;
  if (role === "user") return <UserProfile />;

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Could not determine your role.
    </div>
  );
}
