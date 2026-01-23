"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  MessageSquare,
  Camera,
  Calculator,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteData {
  id: string;
  slug: string;
  company_name: string;
  show_quote_button: boolean;
  quotesnap_user_id: string | null;
}

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Intelligent chatbot guides customers through the quote request process",
  },
  {
    icon: Camera,
    title: "Photo Uploads",
    description: "Customers can upload photos of their project for accurate quotes",
  },
  {
    icon: Calculator,
    title: "Instant Estimates",
    description: "AI analyzes requests and provides preliminary cost estimates",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Automate quote requests and focus on the work that matters",
  },
];

const steps = [
  {
    number: "1",
    title: "Sign up for BrickQuote",
    description: "Create your free BrickQuote account at brickquote.app",
  },
  {
    number: "2",
    title: "Get your User ID",
    description: "Find your User ID in BrickQuote Settings → Account",
  },
  {
    number: "3",
    title: "Connect to BrickProfile",
    description: "Paste your User ID below to enable the Get Quote button",
  },
];

export default function BrickQuotePage() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQuoteButton, setShowQuoteButton] = useState(false);
  const [quotesnapUserId, setQuotesnapUserId] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch("/api/sites");
        if (res.ok) {
          const { sites } = await res.json();
          if (sites && sites.length > 0) {
            setSite(sites[0]);
            setShowQuoteButton(sites[0].show_quote_button || false);
            setQuotesnapUserId(sites[0].quotesnap_user_id || "");
          }
        }
      } catch (error) {
        console.error("Error fetching site:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, []);

  const handleSave = async () => {
    if (!site) return;

    setSaving(true);
    try {
      const response = await fetch("/api/sites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: site.id,
          show_quote_button: showQuoteButton,
          quotesnap_user_id: quotesnapUserId || null,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (quotesnapUserId) {
      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_QUOTESNAP_URL || 'https://brickquote.app'}/request/${quotesnapUserId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-400 font-medium">Powered by BrickQuote</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Get More Quotes with AI
        </h1>
        <p className="text-dark-400 max-w-xl mx-auto">
          BrickQuote is an AI-powered quote request system that helps contractors receive detailed project requests from potential customers.
        </p>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="card p-5">
            <feature.icon className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-dark-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-6">How to Connect BrickQuote</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-sm text-dark-400">{step.description}</p>
                {index === 0 && (
                  <a
                    href="https://brickquote.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 mt-2"
                  >
                    Go to BrickQuote
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Settings */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-brand-400" />
          Connect Your Account
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showQuoteButton}
              onChange={(e) => {
                setShowQuoteButton(e.target.checked);
                setSaved(false);
              }}
              className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="font-medium">Enable "Get Quote" Button</p>
              <p className="text-sm text-dark-400">
                Show a prominent button on your portfolio for instant quote requests
              </p>
            </div>
          </label>

          {showQuoteButton && (
            <div className="ml-8 p-4 bg-dark-800/50 rounded-lg border border-dark-700 space-y-4">
              <div>
                <label className="label">BrickQuote User ID</label>
                <input
                  type="text"
                  value={quotesnapUserId}
                  onChange={(e) => {
                    setQuotesnapUserId(e.target.value);
                    setSaved(false);
                  }}
                  className="input"
                  placeholder="Paste your User ID from BrickQuote"
                />
                <p className="text-xs text-dark-500 mt-1">
                  Find this in BrickQuote → Settings → Account
                </p>
              </div>

              {quotesnapUserId && (
                <div className="p-3 bg-dark-900 rounded-lg">
                  <p className="text-xs text-dark-400 mb-2">Your quote request link:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-amber-400 flex-1 truncate">
                      {process.env.NEXT_PUBLIC_QUOTESNAP_URL || 'https://brickquote.app'}/request/{quotesnapUserId}
                    </code>
                    <button
                      onClick={copyLink}
                      className="btn-ghost btn-sm"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary btn-md"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Preview */}
      {showQuoteButton && quotesnapUserId && site && (
        <div className="card p-6 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Ready to go!</h3>
              <p className="text-sm text-dark-400">
                The "Get Quote" button is now visible on your portfolio.
              </p>
            </div>
            <a
              href={`/site/${site.slug}`}
              target="_blank"
              className="btn-primary btn-md"
            >
              View Portfolio
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-8">
        <p className="text-dark-400 mb-4">
          Don't have a BrickQuote account yet?
        </p>
        <a
          href="https://brickquote.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary btn-lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Sign Up for BrickQuote - Free
          <ArrowRight className="w-5 h-5 ml-2" />
        </a>
      </div>
    </div>
  );
}
