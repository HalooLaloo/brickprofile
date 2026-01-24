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
  Copy,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

interface SettingsFormProps {
  user: { email: string; id: string };
  profile: Profile | null;
  site: { slug: string; custom_domain: string | null; id?: string } | null;
}

export function SettingsForm({ user, profile, site }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [customDomain, setCustomDomain] = useState(site?.custom_domain || "");
  const [domainSaving, setDomainSaving] = useState(false);
  const [domainVerifying, setDomainVerifying] = useState(false);
  const [domainStatus, setDomainStatus] = useState<"unchecked" | "verified" | "pending" | "error">("unchecked");
  const [domainError, setDomainError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDomain = (domain: string) => {
    // Remove protocol and trailing slash
    return domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase()
      .trim();
  };

  const handleSaveDomain = async () => {
    if (!site?.id) return;

    const formattedDomain = formatDomain(customDomain);

    if (formattedDomain && !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(formattedDomain)) {
      setDomainError("Please enter a valid domain (e.g., www.yourcompany.com)");
      return;
    }

    setDomainSaving(true);
    setDomainError("");

    try {
      const response = await fetch("/api/sites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: site.id,
          custom_domain: formattedDomain || null,
        }),
      });

      if (response.ok) {
        setCustomDomain(formattedDomain);
        setDomainStatus(formattedDomain ? "pending" : "unchecked");
        router.refresh();
      } else {
        const data = await response.json();
        setDomainError(data.error || "Failed to save domain");
      }
    } catch (error) {
      console.error("Error saving domain:", error);
      setDomainError("Failed to save domain. Please try again.");
    }

    setDomainSaving(false);
  };

  const handleVerifyDomain = async () => {
    if (!customDomain) return;

    setDomainVerifying(true);
    setDomainError("");

    try {
      const response = await fetch(`/api/domain/verify?domain=${encodeURIComponent(customDomain)}`);
      const data = await response.json();

      if (data.verified) {
        setDomainStatus("verified");
      } else {
        setDomainStatus("pending");
        setDomainError(data.message || "DNS not configured yet. Please add the CNAME record and try again.");
      }
    } catch (error) {
      console.error("Error verifying domain:", error);
      setDomainStatus("error");
      setDomainError("Failed to verify domain. Please try again.");
    }

    setDomainVerifying(false);
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

            {isPro ? (
              <>
                <div>
                  <label className="label">Custom Domain</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="www.yourcompany.com"
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSaveDomain}
                      disabled={domainSaving}
                      className="btn-primary btn-md"
                    >
                      {domainSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                  {domainError && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {domainError}
                    </p>
                  )}
                </div>

                {customDomain && (
                  <>
                    {/* DNS Instructions */}
                    <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
                      <h3 className="font-medium mb-3 text-sm">DNS Configuration</h3>
                      <p className="text-xs text-dark-400 mb-3">
                        Add this CNAME record in your domain provider's DNS settings:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-dark-900">
                          <div className="text-xs">
                            <span className="text-dark-400">Type:</span>{" "}
                            <span className="font-mono text-brand-400">CNAME</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-dark-900">
                          <div className="text-xs flex-1">
                            <span className="text-dark-400">Name:</span>{" "}
                            <span className="font-mono">{customDomain.startsWith("www.") ? "www" : "@"}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(customDomain.startsWith("www.") ? "www" : "@", "name")}
                            className="p-1 hover:bg-dark-700 rounded"
                          >
                            {copied === "name" ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-dark-400" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-dark-900">
                          <div className="text-xs flex-1">
                            <span className="text-dark-400">Value:</span>{" "}
                            <span className="font-mono">cname.vercel-dns.com</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard("cname.vercel-dns.com", "value")}
                            className="p-1 hover:bg-dark-700 rounded"
                          >
                            {copied === "value" ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-dark-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-dark-500 mt-3">
                        DNS changes can take up to 48 hours to propagate.
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50">
                      <div className="flex items-center gap-2">
                        {domainStatus === "verified" ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-green-400">Domain verified</span>
                          </>
                        ) : domainStatus === "pending" ? (
                          <>
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm text-yellow-400">Pending verification</span>
                          </>
                        ) : domainStatus === "error" ? (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-sm text-red-400">Verification failed</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-dark-400" />
                            <span className="text-sm text-dark-400">Not verified</span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={handleVerifyDomain}
                        disabled={domainVerifying}
                        className="btn-secondary btn-sm"
                      >
                        {domainVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Verify
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="relative">
                {/* Blurred preview of custom domain UI */}
                <div className="blur-sm pointer-events-none select-none">
                  <div>
                    <label className="label">Custom Domain</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="www.yourcompany.com"
                        disabled
                        placeholder="www.yourcompany.com"
                        className="input flex-1"
                      />
                      <button
                        disabled
                        className="btn-primary btn-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* DNS Instructions Preview */}
                  <div className="p-4 mt-4 rounded-lg bg-dark-800/50 border border-dark-700">
                    <h3 className="font-medium mb-3 text-sm">DNS Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-dark-900">
                        <div className="text-xs">
                          <span className="text-dark-400">Type:</span>{" "}
                          <span className="font-mono text-brand-400">CNAME</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-dark-900">
                        <div className="text-xs">
                          <span className="text-dark-400">Name:</span>{" "}
                          <span className="font-mono">www</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-dark-900">
                        <div className="text-xs">
                          <span className="text-dark-400">Value:</span>{" "}
                          <span className="font-mono">cname.vercel-dns.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-dark-900/70 backdrop-blur-[1px] rounded-lg">
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="font-semibold mb-1">Custom Domain</p>
                    <p className="text-sm text-dark-400 mb-4">
                      Use your own domain like<br />www.yourcompany.com
                    </p>
                    <Link href="/upgrade" className="btn-primary btn-sm bg-amber-500 hover:bg-amber-600">
                      <Crown className="w-4 h-4 mr-1" />
                      Upgrade to Pro
                    </Link>
                  </div>
                </div>
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
