"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { upload } from "@vercel/blob/client";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

export default function Step1_BasicInfo({
  formData,
  imagePreview,
  handleInputChange,
  setImagePreview,
  deleteImageFromBlob,
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = async () => {
    await deleteImageFromBlob(formData);
    handleInputChange("image", "");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    setUploading(true);
    setUploadProgress(0);

    const randomName = crypto.randomUUID();
    const extension = file.name.split(".").pop();
    const blobPath = `tasks/${randomName}.${extension}`;

    try {
      const result = await upload(blobPath, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (event) => {
          setUploadProgress(Math.round(event.percentage || 0));
        },
      });

      handleInputChange("image", result.url);
    } catch (err) {
      toast({
        title: "upload error",
        description: "Failed to upload image, please try again!",
        variant: "destructive",
      });
      logger.error("Upload failed. Try again.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          Enter the basic information about your task
        </p>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label className="text-gray-300 text-sm">Upload Image</Label>
        <p className="text-gray-500 text-xs">
          This will be a thumbnail for your task
        </p>

        <AnimatePresence mode="wait">
          {imagePreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image
                src={imagePreview}
                width={160}
                height={160}
                alt="Image preview"
                className="rounded-md object-cover border border-border"
                quality={75}
                loader={({ src, width, quality }) =>
                  `${src}?w=${width}&q=${quality || 75}`
                }
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {uploading && (
                <div className="w-full bg-border h-2 rounded overflow-hidden mt-2">
                  <div
                    className="bg-purple-500 h-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                Drag and drop an image here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleImageUpload(e.target.files[0])
                }
                className="hidden"
              />
              {uploading && (
                <div className="w-full bg-border h-2 rounded overflow-hidden mt-4">
                  <div
                    className="bg-purple-500 h-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-300 text-sm">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Enter the title of your task"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="bg-card-box border-border text-foreground placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
    </motion.div>
  );
}
