"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = {
  free: [
    "Professional portfolio website",
    "Free subdomain (you.brickprofile.com)",
    "Up to 10 portfolio photos",
    "All 4 templates",
    "AI content generation",
    "AI photo categorization",
    "Contact form with email leads",
    "5 customer reviews",
  ],
  pro: [
    "Everything in Free, plus:",
    "Unlimited portfolio photos",
    "Custom domain support",
    "Social Media Content Generator",
    "Full analytics dashboard",
    "Unlimited customer reviews",
    "Google Reviews integration",
    "Email notifications for leads",
    "Remove BrickProfile branding",
    "Priority support",
  ],
};

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
          <Crown className="w-4 h-4 text-brand-400" />
          <span className="text-sm text-brand-400">Upgrade to Pro</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Unlock Your Full Potential
        </h1>
        <p className="text-dark-400 max-w-xl mx-auto">
          Get unlimited photos, custom domains, and advanced features to grow
          your business.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-1">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$0</span>
            </div>
            <p className="text-sm text-dark-400 mt-1">
              Perfect for getting started
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            {features.free.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-dark-500" />
                <span className="text-dark-300">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            disabled
            className="btn-secondary btn-lg w-full opacity-50 cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="card p-6 border-brand-500 ring-1 ring-brand-500">
          <div className="badge-primary mb-4">Recommended</div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-1">Pro</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$19.99</span>
              <span className="text-dark-400">/month</span>
            </div>
            <p className="text-sm text-dark-400 mt-1">
              For serious contractors
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            {features.pro.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-brand-400" />
                <span className="text-dark-200">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes, you can cancel your subscription at any time. You'll keep Pro features until the end of your billing period.",
            },
            {
              q: "What happens to my photos if I downgrade?",
              a: "Your photos will remain, but you won't be able to upload more than 20 total. Consider downloading extras first.",
            },
            {
              q: "Do you offer refunds?",
              a: "Yes, we offer a 7-day money-back guarantee. Contact support if you're not satisfied.",
            },
            {
              q: "How does the custom domain work?",
              a: "You can connect any domain you own. We provide simple DNS setup instructions.",
            },
          ].map((faq) => (
            <div key={faq.q} className="card p-5">
              <h3 className="font-medium mb-2">{faq.q}</h3>
              <p className="text-sm text-dark-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
