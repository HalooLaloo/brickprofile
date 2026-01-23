"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Loader2,
  Pencil,
  Trash2,
  Check,
  Crown,
  GripVertical,
  Link,
  Unlink,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo, PhotoCategory } from "@/lib/types";

interface PhotosManagerProps {
  initialPhotos: Photo[];
  maxPhotos: number;
  isPro: boolean;
  siteId: string;
}

const CATEGORIES: { value: PhotoCategory; label: string }[] = [
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "roofing", label: "Roofing" },
  { value: "painting", label: "Painting" },
  { value: "flooring", label: "Flooring" },
  { value: "exterior", label: "Exterior" },
  { value: "landscaping", label: "Landscaping" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "general", label: "General" },
  { value: "other", label: "Other" },
];

export function PhotosManager({
  initialPhotos,
  maxPhotos,
  isPro,
  siteId,
}: PhotosManagerProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ caption: "", category: "" });

  // Before/After pairing state
  const [pairingMode, setPairingMode] = useState(false);
  const [selectedForPairing, setSelectedForPairing] = useState<string | null>(null);

  const canUpload = photos.length < maxPhotos;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!canUpload) return;

      const remainingSlots = maxPhotos - photos.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      setUploading(true);

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            const { url, category, caption } = await uploadResponse.json();

            // Create photo record
            const createResponse = await fetch("/api/photos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url, category, caption, site_id: siteId }),
            });

            if (createResponse.ok) {
              const { photo } = await createResponse.json();
              setPhotos((prev) => [...prev, photo]);
            }
          }
        } catch (error) {
          console.error("Upload error:", error);
        }
      }

      setUploading(false);
      router.refresh();
    },
    [photos.length, maxPhotos, canUpload, router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024,
    disabled: !canUpload || uploading,
  });

  const handleEdit = (photo: Photo) => {
    setEditingId(photo.id);
    setEditForm({
      caption: photo.caption || "",
      category: photo.category || "general",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const response = await fetch("/api/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          caption: editForm.caption,
          category: editForm.category,
        }),
      });

      if (response.ok) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...p, caption: editForm.caption, category: editForm.category as PhotoCategory }
              : p
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const response = await fetch(`/api/photos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  // Before/After pairing functions
  const handleStartPairing = (photoId: string) => {
    setPairingMode(true);
    setSelectedForPairing(photoId);
  };

  const handleSelectPairPhoto = async (afterPhotoId: string) => {
    if (!selectedForPairing || selectedForPairing === afterPhotoId) return;

    try {
      const response = await fetch("/api/photos/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beforePhotoId: selectedForPairing,
          afterPhotoId: afterPhotoId,
        }),
      });

      if (response.ok) {
        const { pair_id } = await response.json();
        setPhotos((prev) =>
          prev.map((p) => {
            if (p.id === selectedForPairing) {
              return { ...p, is_before_after: true, pair_id, is_before: true };
            }
            if (p.id === afterPhotoId) {
              return { ...p, is_before_after: true, pair_id, is_before: false };
            }
            return p;
          })
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating pair:", error);
    }

    setPairingMode(false);
    setSelectedForPairing(null);
  };

  const handleUnpair = async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo?.pair_id) return;

    try {
      const response = await fetch("/api/photos/pair", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair_id: photo.pair_id }),
      });

      if (response.ok) {
        setPhotos((prev) =>
          prev.map((p) => {
            if (p.pair_id === photo.pair_id) {
              return { ...p, is_before_after: false, pair_id: null, is_before: null };
            }
            return p;
          })
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error removing pair:", error);
    }
  };

  const cancelPairing = () => {
    setPairingMode(false);
    setSelectedForPairing(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-brand-500 bg-brand-500/10"
            : "border-dark-700 hover:border-dark-600",
          !canUpload && "opacity-50 cursor-not-allowed"
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
                : canUpload
                ? "Drag & drop photos, or click to select"
                : "Photo limit reached"}
            </p>
            <p className="text-sm text-dark-500 mt-1">
              {photos.length}/{maxPhotos === Infinity ? "∞" : maxPhotos} photos •
              Max 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade prompt */}
      {!isPro && photos.length >= maxPhotos * 0.8 && (
        <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-brand-400" />
            <div>
              <p className="font-medium">Running low on photo slots?</p>
              <p className="text-sm text-dark-400">
                Upgrade to Pro for unlimited photos.
              </p>
            </div>
          </div>
          <a href="/upgrade" className="btn-primary btn-sm">
            Upgrade
          </a>
        </div>
      )}

      {/* Pairing mode banner */}
      {pairingMode && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-400">Select "After" Photo</p>
              <p className="text-sm text-dark-400">
                Click on another photo to pair it as the "After" image
              </p>
            </div>
          </div>
          <button
            onClick={cancelPairing}
            className="btn-secondary btn-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const isPaired = photo.is_before_after && photo.pair_id;
            const isSelectedForPairing = selectedForPairing === photo.id;
            const canSelectForPair = pairingMode && !isSelectedForPairing && !isPaired;

            return (
              <div
                key={photo.id}
                onClick={() => canSelectForPair && handleSelectPairPhoto(photo.id)}
                className={cn(
                  "group relative aspect-square rounded-xl overflow-hidden bg-dark-800 border transition-all",
                  isSelectedForPairing
                    ? "border-amber-500 ring-2 ring-amber-500/50"
                    : isPaired
                    ? "border-green-500/50"
                    : "border-dark-700",
                  canSelectForPair && "cursor-pointer hover:border-amber-500"
                )}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Portfolio photo"}
                  className="w-full h-full object-cover"
                />

                {/* Before/After badge */}
                {isPaired && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-green-500/90 text-xs font-medium text-white">
                    {photo.is_before ? "Before" : "After"}
                  </div>
                )}

                {/* Selected for pairing indicator */}
                {isSelectedForPairing && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-amber-500/90 text-xs font-medium text-white">
                    Before
                  </div>
                )}

                {/* Overlay on hover (disabled during pairing mode) */}
                {!pairingMode && (
                  <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col">
                    {/* Actions */}
                    <div className="flex justify-end gap-1 p-2">
                      {!isPaired ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPairing(photo.id);
                          }}
                          className="p-2 rounded-lg bg-dark-800 hover:bg-amber-600 transition-colors"
                          title="Create Before/After pair"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnpair(photo.id);
                          }}
                          className="p-2 rounded-lg bg-dark-800 hover:bg-orange-600 transition-colors"
                          title="Remove Before/After pair"
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(photo);
                        }}
                        className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                        className="p-2 rounded-lg bg-dark-800 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="mt-auto p-3">
                      <span className="badge-primary capitalize">
                        {photo.category}
                      </span>
                      {photo.caption && (
                        <p className="text-sm text-dark-300 mt-2 line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit modal */}
                {editingId === photo.id && (
                  <div className="absolute inset-0 bg-dark-900 p-4 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div>
                        <label className="label text-xs">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="input text-sm py-1.5"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label text-xs">Caption</label>
                        <textarea
                          value={editForm.caption}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              caption: e.target.value,
                            }))
                          }
                          className="input text-sm py-1.5"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-secondary btn-sm flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="btn-primary btn-sm flex-1"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-dark-500">
          <p>No photos yet. Upload some to showcase your work!</p>
        </div>
      )}
    </div>
  );
}
