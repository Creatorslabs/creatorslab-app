"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface Props {
  currentAvatar: string;
  username: string;
  onUploadComplete: (url: string) => void;
}

export default function AvatarUploader({
  currentAvatar,
  username,
  onUploadComplete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 3;
    if (!validTypes.includes(file.type)) {
      toast({ title: "Unsupported file type", variant: "destructive" });
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({ title: "Image too large (max 3MB)", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop();
    const randomName = `${crypto.randomUUID()}.${extension}`;

    try {
      setUploading(true);
      const blob = await upload(`profile/${randomName}`, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (e) => setProgress(e.percentage),
      });

      onUploadComplete(blob.url);
      toast({ title: "Avatar updated successfully" });
    } catch (err) {
      logger.error(err);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      setModalOpen(false);
      setSelectedFile(null);
      setPreview(null);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="relative mx-auto md:mx-0 w-fit">
        <Image
          src={currentAvatar}
          alt={username}
          width={150}
          height={150}
          className="rounded-full border-4 border-border aspect-square object-cover"
          quality={75}
          loader={({ src, width, quality }) =>
            `${src}?w=${width}&q=${quality || 75}`
          }
        />
        <button
          onClick={handleSelectFile}
          className="absolute bottom-2 right-0 w-8 h-8 bg-foreground rounded-md flex items-center justify-center hover:scale-105 transition"
        >
          <Camera className="w-4 h-4 text-background" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card-box text-foreground space-y-4">
          <h3 className="text-lg font-semibold">Confirm New Avatar</h3>
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg mx-auto object-cover aspect-square"
            />
          )}
          {uploading ? (
            <div className="text-sm text-muted-foreground text-center">
              Uploading... {progress.toFixed(0)}%
              <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="text-sm px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/70"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="text-sm px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Upload
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
