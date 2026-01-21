"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  id: string;
  url: string;
  file?: File;
  category?: string;
  caption?: string;
  uploading?: boolean;
}

interface PhotoUploaderProps {
  photos: UploadedPhoto[];
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  maxPhotos?: number;
}

// Free plan: 10 photos, Pro: unlimited (1000)
export const FREE_PHOTO_LIMIT = 10;
export const PRO_PHOTO_LIMIT = 1000;

export function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = FREE_PHOTO_LIMIT,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<UploadedPhoto[]>(photos);

  // Sync local state with parent
  useEffect(() => {
    setLocalPhotos(photos);
  }, [photos]);

  const updatePhotos = (newPhotos: UploadedPhoto[]) => {
    setLocalPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxPhotos - localPhotos.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      if (filesToUpload.length === 0) return;

      setUploading(true);

      // Create temporary preview URLs
      const newPhotos: UploadedPhoto[] = filesToUpload.map((file) => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        file,
        uploading: true,
      }));

      const allPhotos = [...localPhotos, ...newPhotos];
      setLocalPhotos(allPhotos);

      // Upload each file
      let currentPhotos = allPhotos;
      for (const photo of newPhotos) {
        if (!photo.file) continue;

        const formData = new FormData();
        formData.append("file", photo.file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();

            // Update the photo with the uploaded URL
            currentPhotos = currentPhotos.map((p) =>
              p.id === photo.id
                ? {
                    ...p,
                    url: data.url,
                    uploading: false,
                    category: data.category,
                    caption: data.caption,
                  }
                : p
            );
            setLocalPhotos(currentPhotos);
          } else {
            // Remove failed upload and show error
            const errorData = await response.json();
            console.error("Upload failed:", errorData);
            alert(`Upload failed: ${errorData.error || "Unknown error"}`);
            currentPhotos = currentPhotos.filter((p) => p.id !== photo.id);
            setLocalPhotos(currentPhotos);
          }
        } catch (error) {
          console.error("Upload error:", error);
          currentPhotos = currentPhotos.filter((p) => p.id !== photo.id);
          setLocalPhotos(currentPhotos);
        }
      }

      onPhotosChange(currentPhotos);
      setUploading(false);
    },
    [localPhotos, maxPhotos, onPhotosChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: localPhotos.length >= maxPhotos,
  });

  const removePhoto = (id: string) => {
    const newPhotos = localPhotos.filter((p) => p.id !== id);
    updatePhotos(newPhotos);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-brand-500 bg-brand-500/10"
            : "border-dark-700 hover:border-dark-600",
          localPhotos.length >= maxPhotos && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-dark-500" />
          )}
          <div>
            <p className="font-medium">
              {isDragActive
                ? "Drop your photos here"
                : "Drag & drop photos, or click to select"}
            </p>
            <p className="text-sm text-dark-500 mt-1">
              {localPhotos.length}/{maxPhotos} photos • Max 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      {localPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {localPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-dark-800 group"
            >
              {photo.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                </div>
              ) : (
                <>
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-900/80 text-dark-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {photo.category && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-dark-900/80 text-xs capitalize">
                      {photo.category}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
