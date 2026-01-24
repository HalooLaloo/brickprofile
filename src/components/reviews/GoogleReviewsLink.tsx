"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ExternalLink,
  Check,
  Loader2,
  Crown,
  Link as LinkIcon,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleReviewsLinkProps {
  siteId: string;
  initialUrl: string | null;
  isPro: boolean;
}

export function GoogleReviewsLink({
  siteId,
  initialUrl,
  isPro,
}: GoogleReviewsLinkProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/sites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteId,
          google_reviews_url: url || null,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      } else {
        alert("Failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    }

    setSaving(false);
  };

  if (!isPro) {
    return (
      <div className="card p-5 bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/20">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-brand-500/20">
            <Star className="w-5 h-5 text-brand-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">Google Reviews Link</h3>
              <span className="badge-primary text-xs flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            </div>
            <p className="text-sm text-dark-400 mb-3">
              Add a link to your Google Business reviews. Visitors can click to see all your reviews on Google.
            </p>
            <a href="/upgrade" className="btn-primary btn-sm">
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">Google Reviews Link</h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-dark-500 hover:text-dark-300"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-dark-400 mb-4">
            Paste a link to your business on Google Maps. A "View our Google Reviews" button will appear on your portfolio.
          </p>

          {showHelp && (
            <div className="mb-4 p-3 rounded-lg bg-dark-800 text-sm">
              <p className="font-medium mb-2">How to get your Google Reviews link:</p>
              <ol className="list-decimal list-inside space-y-2 text-dark-400">
                <li>Open <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline">Google Maps</a></li>
                <li>Search for your business name</li>
                <li>Click on your business</li>
                <li>Copy the link from your browser's address bar</li>
              </ol>
              <div className="mt-3 p-2 rounded bg-dark-900 text-xs text-dark-500">
                <p className="mb-1">Example link:</p>
                <code className="text-dark-400 break-all">https://google.com/maps/place/Your+Business+Name/...</code>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Paste your Google Maps link here"
                  className="input pl-10"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary btn-md"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                "Save"
              )}
            </button>
          </div>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 mt-3"
            >
              Preview link
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
