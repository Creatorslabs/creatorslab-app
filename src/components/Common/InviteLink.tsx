"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function InviteLinkButton({
  inviteLink,
}: {
  inviteLink: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({ title: "Invite link copied!", variant: "success" });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy link", variant: "destructive" });
    }
  };

  return (
    <button
      onClick={handleCopyInviteLink}
      className="bg-card h-fit py-4 px-6 rounded-lg flex gap-2 items-center text-white hover:bg-card/80 transition"
    >
      {copied ? "Copied!" : "Invite Link"}
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}
