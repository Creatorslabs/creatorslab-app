"use client";

import { motion } from "framer-motion";
import { UserX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreatorNotFound({ username }: { username?: string }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4"
    >
      <UserX className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="text-lg text-white font-semibold mb-1">
        Creator not found
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        {username
          ? `We couldn’t find a creator with the username “${username}”.`
          : "This creator profile doesn't exist or has been removed."}
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        <Link href="/creators">
          <Button variant="ghost" className="text-primary">
            Browse all creators
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
