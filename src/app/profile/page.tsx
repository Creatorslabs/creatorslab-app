"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useLoader } from "@/hooks/useLoader";
import CreatorProfile from "./CreatorProfile";
import UserProfile from "./UserProfile";
import { logger } from "@/lib/logger";

type UserRole = "user" | "creator";

interface UserData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  email: string;
  inviteLink: string;
  balance: string;
  role: UserRole;
}

interface UserResponse {
  success: boolean;
  data: UserData;
}

async function fetchUser(): Promise<UserResponse> {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export default function UserProfileWrapper() {
  const { LoaderModal, showLoader, hideLoader } = useLoader();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<UserResponse>({
    queryKey: ["user-profile"],
    queryFn: fetchUser,
    retry: 1,
    staleTime: 1000 * 60,
  });

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

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Could not load your profile.
      </div>
    );
  }

  const user = data.data;
  const role = user.role || "user"; // default to user if missing

  const refreshProfile = () =>
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });

  if (role === "creator")
    return (
      <CreatorProfile creator={{ ...user }} refreshProfile={refreshProfile} />
    );

  return <UserProfile {...user} />;
}
