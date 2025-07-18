"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, Clock } from "lucide-react";
import { put } from "@vercel/blob";
import Image from "next/image";

type Props = {
  status: "pending" | "completed" | null;
  taskId: string;
  proofLink: string;
  setProofLink: (link: string) => void;
};

async function deleteImageFromBlob(formData: { image?: string }) {
  if (!formData.image) return;

  try {
    const res = await fetch("/api/delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: formData.image }),
    });

    if (!res.ok) {
      console.error("Failed to delete image from Blob");
    } else {
      console.log("Image deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting image:", err);
  }
}

export function ProofSubmissionSection({
  status,
  taskId,
  proofLink,
  setProofLink,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const blob = await put(file.name, file, {
        access: "public",
      });

      setProofLink(blob.url);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!proofLink) return;
    await deleteImageFromBlob({ image: proofLink });
    setProofLink("");
  };

  const statusDisplay = {
    null: {
      icon: null,
      label: "No proof submitted yet",
      color: "text-gray-400",
    },
    pending: {
      icon: <Clock className="w-4 h-4 text-yellow-400" />,
      label: "Proof pending review",
      color: "text-yellow-400",
    },
    completed: {
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      label: "Task completed",
      color: "text-green-400",
    },
  };

  const current = statusDisplay[status ?? "null"];

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4 p-4 border border-border bg-card-box rounded-xl"
    >
      <div className="flex items-center gap-2">
        {current.icon}
        <span className={`text-sm font-medium ${current.color}`}>
          {current.label}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium">
          Paste proof link
        </label>
        <Input
          placeholder="https://..."
          value={proofLink}
          onChange={(e) => setProofLink(e.target.value)}
          className="border border-border"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium">
          Or upload image proof
        </label>

        {proofLink &&
        proofLink.startsWith("https://blob.vercel-storage.com") ? (
          <div className="relative w-full max-w-sm">
            <Image
              src={proofLink}
              alt="Uploaded proof"
              className="w-full h-auto rounded-lg border border-border"
              width={150}
              height={100}
              quality={75}
              loader={({ src, width, quality }) =>
                `${src}?w=${width}&q=${quality || 75}`
              }
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80 transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 text-sm cursor-pointer text-blue-400 hover:text-blue-300">
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Click to upload image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </motion.div>
  );
}
