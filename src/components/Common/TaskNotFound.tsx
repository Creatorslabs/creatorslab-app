"use client";

import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TaskNotFound() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4"
    >
      <FileQuestion className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="text-lg text-white font-semibold mb-1">Task not found</h2>
      <p className="text-sm text-gray-400 mb-6">
        This task might have been removed or doesn&apos;t exist.
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

        <Link href="/tasks">
          <Button variant="ghost" className="text-primary">
            Browse all tasks
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
