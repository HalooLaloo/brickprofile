"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Globe,
  LogOut,
  Loader2,
  Crown,
  ExternalLink,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

interface SettingsFormProps {
  user: { email: string; id: string };
  profile: Profile | null;
  site: { slug: string; custom_domain: string | null } | null;
}

export function SettingsForm({ user, profile, site }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const isPro = profile?.plan === "pro";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal. Please try again.");
    }

    setPortalLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-400" />
          Account
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input opacity-60"
            />
          </div>
          <div>
            <label className="label">Company Name</label>
            <input
              type="text"
              value={profile?.company_name || ""}
              disabled
              className="input opacity-60"
            />
            <p className="text-xs text-dark-500 mt-1">
              Edit in the Website Editor
            </p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-400" />
          Subscription
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-dark-800/50">
            <div className="flex items-center gap-3">
              {isPro ? (
                <Crown className="w-6 h-6 text-brand-400" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-dark-700" />
              )}
              <div>
                <p className="font-medium">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </p>
                <p className="text-sm text-dark-400">
                  {isPro ? "$9.99/month" : "Limited features"}
                </p>
              </div>
            </div>
            <span
              className={`badge ${
                isPro ? "badge-success" : "badge-warning"
              }`}
            >
              {profile?.subscription_status || "active"}
            </span>
          </div>

          {isPro ? (
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="btn-secondary btn-md w-full"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              Manage Subscription
            </button>
          ) : (
            <a href="/upgrade" className="btn-primary btn-md w-full block text-center">
              <Crown className="w-4 h-4 mr-2 inline" />
              Upgrade to Pro
            </a>
          )}
        </div>
      </div>

      {/* Domain Settings (Pro only) */}
      {site && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-400" />
            Domain
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Your Site URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${site.slug}.brickprofile.com`}
                  disabled
                  className="input flex-1 opacity-60"
                />
                <a
                  href={`/site/${site.slug}`}
                  target="_blank"
                  className="btn-secondary btn-md"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {isPro && (
              <div>
                <label className="label">Custom Domain</label>
                <input
                  type="text"
                  value={site.custom_domain || ""}
                  placeholder="www.yourcompany.com"
                  className="input"
                  disabled
                />
                <p className="text-xs text-dark-500 mt-1">
                  Contact support to set up your custom domain.
                </p>
              </div>
            )}

            {!isPro && (
              <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <p className="text-sm">
                  <Crown className="w-4 h-4 inline mr-1 text-brand-400" />
                  Upgrade to Pro to use a custom domain.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="card p-6 border-red-500/20">
        <h2 className="text-lg font-semibold mb-4 text-red-400">
          Danger Zone
        </h2>
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="btn-secondary btn-md w-full text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
