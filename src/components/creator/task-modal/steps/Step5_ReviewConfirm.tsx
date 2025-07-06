"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { RenderReview } from "../RenderReview";

export default function Step5_ReviewConfirm({
  formData,
  imagePreview,
  socialPlatforms,
}: any) {
  const platformLabel = socialPlatforms.find(
    (p: any) => p.value === formData.platform
  )?.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Review & Confirm
        </h3>
        <p className="text-gray-400 text-sm">
          Please review your task details before submitting
        </p>
      </div>

      {/* Review Card */}
      <div className="bg-card-box rounded-lg p-5 space-y-4 border border-border max-h-[55vh] overflow-y-auto custom-scroll">
        {/* Image Preview */}
        {imagePreview && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm w-24 shrink-0">Image:</span>
            <Image
              width={40}
              height={40}
              src={imagePreview}
              alt="Preview"
              className="rounded-md object-cover"
              quality={75}
              loader={({ src, width, quality }) =>
                `${src}?w=${width}&q=${quality || 75}`
              }
            />
          </div>
        )}

        <RenderReview label="Title" value={formData.title} />
        <RenderReview label="Platform" value={platformLabel} />
        <RenderReview label="Target" value={formData.target} />
        <RenderReview
          label="Reward Points"
          value={String(formData.rewardPoints)}
        />
        <RenderReview
          label="Max Participants"
          value={String(formData.maxParticipants)}
        />
        <RenderReview
          label="Expiration"
          value={formData.expiration || "Not set"}
        />
        <RenderReview
          label="Description"
          value={formData.description}
          multiline
        />

        {/* Engagement Types */}
        <div className="flex items-start space-x-3">
          <span className="text-gray-400 text-sm w-24 shrink-0">
            Engagement:
          </span>
          <div className="flex flex-wrap gap-2">
            {formData.type.map((engagement: string) => (
              <Badge
                key={engagement}
                variant="outline"
                className="border-border text-gray-300"
              >
                {engagement}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
