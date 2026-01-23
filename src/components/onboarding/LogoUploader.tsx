"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export function LogoUploader({ logo, onLogoChange }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "logo");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          onLogoChange(url);
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
      }

      setUploading(false);
    },
    [onLogoChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".svg"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: uploading,
  });

  const handleRemove = () => {
    onLogoChange(null);
  };

  if (logo) {
    return (
      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-dark-800 border border-dark-700 group">
        <img
          src={logo}
          alt="Company logo"
          className="w-full h-full object-contain p-2"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center gap-2",
        isDragActive
          ? "border-brand-500 bg-brand-500/10"
          : "border-dark-700 hover:border-dark-600 bg-dark-800/50"
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      ) : (
        <>
          <ImageIcon className="w-6 h-6 text-dark-500" />
          <span className="text-xs text-dark-500 text-center px-2">
            {isDragActive ? "Drop logo" : "Upload logo"}
          </span>
        </>
      )}
    </div>
  );
}
