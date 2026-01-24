"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Image as ImageIcon,
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  Loader2,
  ArrowRight,
  Lightbulb,
  Gift,
  MessageSquareQuote,
  Crown,
  HelpCircle,
  Hammer,
  Download,
  MessageCircleQuestion,
  Scale,
  Lock,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  category?: string;
  caption?: string;
}

type Platform = "facebook" | "instagram";
type PostType = "before-after" | "showcase" | "quick-tip" | "question" | "did-you-know" | "this-or-that" | "behind-scenes" | "testimonial" | "offer";

const postTypes = [
  {
    id: "before-after" as PostType,
    name: "Before & After",
    description: "Show the transformation of your work",
    icon: ArrowRight,
    needsPhotos: true,
  },
  {
    id: "showcase" as PostType,
    name: "Project Showcase",
    description: "Highlight a recent completed project",
    icon: ImageIcon,
    needsPhotos: true,
  },
  {
    id: "quick-tip" as PostType,
    name: "Quick Tip",
    description: "Short tip with an engaging question",
    icon: Lightbulb,
    needsPhotos: false,
  },
  {
    id: "question" as PostType,
    name: "Question / Poll",
    description: "Ask followers an engaging question",
    icon: MessageCircleQuestion,
    needsPhotos: false,
  },
  {
    id: "did-you-know" as PostType,
    name: "Did You Know?",
    description: "Share an interesting industry fact",
    icon: HelpCircle,
    needsPhotos: false,
  },
  {
    id: "this-or-that" as PostType,
    name: "This or That",
    description: "Fun comparison to spark discussion",
    icon: Scale,
    needsPhotos: false,
  },
  {
    id: "behind-scenes" as PostType,
    name: "Behind the Scenes",
    description: "Show the real work process",
    icon: Hammer,
    needsPhotos: true,
  },
  {
    id: "testimonial" as PostType,
    name: "Customer Testimonial",
    description: "Share a positive review from a client",
    icon: MessageSquareQuote,
    needsPhotos: true,
  },
  {
    id: "offer" as PostType,
    name: "Special Offer",
    description: "Promote a discount or special deal",
    icon: Gift,
    needsPhotos: false,
  },
];

export default function SocialPage() {
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [postType, setPostType] = useState<PostType>("before-after");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [generatedPost, setGeneratedPost] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [companyInfo, setCompanyInfo] = useState<{
    company_name: string;
    services: { name: string }[];
    service_areas: string[];
  } | null>(null);

  // Fetch user's photos, company info, and plan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, sitesRes, profileRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/sites"),
          fetch("/api/profile"),
        ]);

        if (photosRes.ok) {
          const { photos } = await photosRes.json();
          setPhotos(photos || []);
        }

        if (sitesRes.ok) {
          const { sites } = await sitesRes.json();
          if (sites && sites.length > 0) {
            setCompanyInfo({
              company_name: sites[0].company_name,
              services: sites[0].services || [],
              service_areas: sites[0].service_areas || [],
            });
          }
        }

        if (profileRes.ok) {
          const { profile } = await profileRes.json();
          setIsPro(profile?.plan === "pro");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchData();
  }, []);

  const togglePhoto = (photoId: string) => {
    setSelectedPhotos((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      }
      // Limit selection based on post type
      const maxPhotos = postType === "before-after" ? 2 : 4;
      if (prev.length >= maxPhotos) {
        return [...prev.slice(1), photoId];
      }
      return [...prev, photoId];
    });
  };

  const generatePost = async () => {
    const currentPostType = postTypes.find(t => t.id === postType);
    if (currentPostType?.needsPhotos && selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }

    setLoading(true);
    setGeneratedPost("");

    try {
      const response = await fetch("/api/ai/generate-social-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          postType,
          photos: selectedPhotos.map((id) => photos.find((p) => p.id === id)),
          companyInfo,
        }),
      });

      if (response.ok) {
        const { post } = await response.json();
        setGeneratedPost(post);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to generate post");
      }
    } catch (error) {
      console.error("Error generating post:", error);
      alert("Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const downloadAllImages = async () => {
    for (let i = 0; i < selectedPhotos.length; i++) {
      const photo = photos.find((p) => p.id === selectedPhotos[i]);
      if (photo) {
        const label = postType === "before-after"
          ? (i === 0 ? "before" : "after")
          : `photo-${i + 1}`;
        await downloadImage(photo.url, `${companyInfo?.company_name || "post"}-${label}.jpg`);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  // Loading state
  if (isPro === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Create Social Media Content</h1>
        <p className="text-dark-400">
          Generate engaging posts for your social media with AI assistance.
        </p>
      </div>

      {/* Platform Selection */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">1. Choose Platform</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPlatform("facebook")}
            className={cn(
              "flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-3",
              platform === "facebook"
                ? "border-blue-500 bg-blue-500/10"
                : "border-dark-700 hover:border-dark-600"
            )}
          >
            <Facebook
              className={cn(
                "w-6 h-6",
                platform === "facebook" ? "text-blue-500" : "text-dark-400"
              )}
            />
            <span className="font-medium">Facebook</span>
          </button>
          <button
            onClick={() => setPlatform("instagram")}
            className={cn(
              "flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-3",
              platform === "instagram"
                ? "border-pink-500 bg-pink-500/10"
                : "border-dark-700 hover:border-dark-600"
            )}
          >
            <Instagram
              className={cn(
                "w-6 h-6",
                platform === "instagram" ? "text-pink-500" : "text-dark-400"
              )}
            />
            <span className="font-medium">Instagram</span>
          </button>
        </div>
      </div>

      {/* Post Type Selection */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">2. Choose Post Type</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {postTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setPostType(type.id);
                setSelectedPhotos([]);
              }}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                postType === type.id
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-dark-700 hover:border-dark-600"
              )}
            >
              <type.icon
                className={cn(
                  "w-5 h-5 mb-2",
                  postType === type.id ? "text-brand-400" : "text-dark-400"
                )}
              />
              <p className="font-medium">{type.name}</p>
              <p className="text-xs text-dark-400 mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Photo Selection */}
      {postTypes.find(t => t.id === postType)?.needsPhotos && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-2">3. Select Photos</h2>
          <p className="text-sm text-dark-400 mb-4">
            {postType === "before-after"
              ? "Select 2 photos: first the BEFORE, then the AFTER"
              : "Select up to 4 photos for your post"}
          </p>

          {loadingPhotos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12 text-dark-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No photos in your portfolio yet.</p>
              <p className="text-sm">Upload photos in the Photos section first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {photos.map((photo, index) => {
                const isSelected = selectedPhotos.includes(photo.id);
                const selectionIndex = selectedPhotos.indexOf(photo.id);

                return (
                  <button
                    key={photo.id}
                    onClick={() => togglePhoto(photo.id)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      isSelected
                        ? "border-brand-500 ring-2 ring-brand-500/50"
                        : "border-transparent hover:border-dark-600"
                    )}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                          {postType === "before-after"
                            ? selectionIndex === 0
                              ? "B"
                              : "A"
                            : selectionIndex + 1}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {selectedPhotos.length > 0 && postType === "before-after" && (
            <p className="text-sm text-dark-400 mt-3">
              {selectedPhotos.length === 1
                ? "Now select the AFTER photo"
                : "✓ Before & After photos selected"}
            </p>
          )}
        </div>
      )}

      {/* Generate Button */}
      <div className="flex flex-col items-center gap-4">
        {!isPro ? (
          <>
            <div className="relative">
              <button
                disabled
                className="btn-primary btn-lg px-8 opacity-50 cursor-not-allowed"
              >
                <Lock className="w-5 h-5 mr-2" />
                Generate Post
              </button>
            </div>
            <div className="card p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 max-w-md text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-amber-400">Pro Feature</span>
              </div>
              <p className="text-sm text-dark-400 mb-3">
                Upgrade to Pro to generate unlimited social media posts with AI
              </p>
              <Link href="/upgrade" className="btn-primary btn-sm bg-amber-500 hover:bg-amber-600">
                Upgrade to Pro - $19.99/mo
              </Link>
            </div>
          </>
        ) : (
          <button
            onClick={generatePost}
            disabled={loading}
            className="btn-primary btn-lg px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Post
              </>
            )}
          </button>
        )}
      </div>

      {/* Generated Post */}
      {generatedPost && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated Post</h2>
            <div className="flex gap-2">
              <button
                onClick={generatePost}
                disabled={loading}
                className="btn-secondary btn-sm"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Regenerate
              </button>
              <button onClick={copyToClipboard} className="btn-primary btn-sm">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-dark-800/50 rounded-lg p-4 whitespace-pre-wrap">
            {generatedPost}
          </div>

          {selectedPhotos.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-dark-400">Photos to include:</p>
                <button
                  onClick={downloadAllImages}
                  className="btn-secondary btn-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Images
                </button>
              </div>
              <div className="flex gap-2">
                {selectedPhotos.map((id, index) => {
                  const photo = photos.find((p) => p.id === id);
                  return (
                    <div
                      key={id}
                      className="w-16 h-16 rounded-lg overflow-hidden relative cursor-pointer group"
                      onClick={() => photo && downloadImage(photo.url, `photo-${index + 1}.jpg`)}
                      title="Click to download"
                    >
                      <img
                        src={photo?.url}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Download className="w-4 h-4 text-white" />
                      </div>
                      {postType === "before-after" && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center text-xs py-0.5">
                          {index === 0 ? "Before" : "After"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-xs text-dark-500 mt-4">
            {platform === "instagram"
              ? "Copy this text and paste it as your Instagram caption."
              : "Copy this text and paste it as your Facebook post."}
          </p>
        </div>
      )}
    </div>
  );
}
