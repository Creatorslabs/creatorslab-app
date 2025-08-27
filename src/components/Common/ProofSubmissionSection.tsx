"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Upload, X, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { upload } from "@vercel/blob/client";
import { Progress } from "@/components/ui/progress";

type Props = {
  status: "pending" | "completed" | null;
  proofLink: string;
  setProofLink: (link: string) => void;
  canParticipate: boolean;
  reason: string | null;
};

async function deleteImageFromBlob(formData: { image?: string }) {
  if (!formData.image) return;
  try {
    const res = await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: formData.image }),
    });
    if (!res.ok) logger.error("Failed to delete image from Blob");
    else logger.log("Image deleted successfully");
  } catch (err) {
    logger.error("Error deleting image:", err);
  }
}

export function ProofSubmissionSection({
  status,
  proofLink,
  setProofLink,
  canParticipate,
  reason,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canParticipate) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      setUploading(true);
      setUploadProgress(0);

      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress(e) {
          setUploadProgress(e.percentage);
        },
      });

      setProofLink(newBlob.url);
      setPreview(null);
    } catch (err) {
      logger.error("Image upload failed:", err);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!proofLink || !canParticipate) return;
    await deleteImageFromBlob({ image: proofLink });
    setProofLink("");
    setPreview(null);
    setUploadProgress(0);
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

  const imageUrl =
    preview ||
    (proofLink.includes("vercel") && proofLink.includes("blob")
      ? proofLink
      : "");

  const maskedLink =
    proofLink && proofLink.includes("vercel") && proofLink.includes("blob")
      ? `https://********${proofLink.slice(-4)}`
      : proofLink;

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4 p-4 border border-border bg-card-box rounded-xl"
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        {current.icon}
        <span className={`text-sm font-medium ${current.color}`}>
          {current.label}
        </span>
      </div>

      {/* Restriction warning */}
      {!canParticipate && reason && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-yellow-900/30 text-yellow-300 border border-yellow-800 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <span>{reason}</span>
        </div>
      )}

      {/* Proof link */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">
          Paste proof link
        </label>
        <Input
          placeholder="https://..."
          value={maskedLink}
          onChange={(e) => setProofLink(e.target.value)}
          className="border border-border"
          disabled={!canParticipate || !!imageUrl}
        />
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">
          Or upload image proof
        </label>

        {imageUrl ? (
          <div className="relative w-48">
            <Image
              src={imageUrl}
              alt="Uploaded proof"
              className="w-full h-auto rounded-lg border border-border object-cover"
              width={200}
              height={140}
              quality={80}
              loader={({ src, width, quality }) =>
                `${src}?w=${width}&q=${quality || 75}`
              }
            />
            {canParticipate && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80 transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg text-white text-sm gap-2">
                <span>Uploading...</span>
                <Progress value={uploadProgress} className="w-32 h-2" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "relative flex items-center justify-center gap-2 px-4 py-10 border border-dashed border-border rounded-lg text-sm transition",
              canParticipate
                ? "hover:bg-accent/10 cursor-pointer text-gray-300"
                : "text-gray-500 cursor-not-allowed"
            )}
          >
            <Upload className="w-5 h-5" />
            <span>{uploading ? `Uploading...` : "Click to upload image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={!canParticipate}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
