"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BrickWall,
  PenSquare,
  Images,
  Star,
  BarChart3,
  Settings,
  Sparkles,
  ExternalLink,
  Crown,
  Users,
  ChevronDown,
  Plus,
  Check,
  Share2,
  CreditCard,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

interface SiteInfo {
  id: string;
  slug: string;
  is_published: boolean;
  company_name: string;
}

interface SidebarProps {
  user: { email: string; id: string };
  profile: Profile | null;
  sites: SiteInfo[];
  activeSite: SiteInfo | null;
  canCreateMore: boolean;
  maxSites: number;
}

const navigation = [
  { name: "Edit Website", href: "/editor", icon: PenSquare },
  { name: "Photos", href: "/photos", icon: Images },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "BrickQuote", href: "/brickquote", icon: Zap, highlight: true },
  { name: "Social Content", href: "/social", icon: Share2, pro: true },
  { name: "Business Cards", href: "/business-cards", icon: CreditCard, pro: true },
  { name: "Analytics", href: "/analytics", icon: BarChart3, pro: true },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ user, profile, sites, activeSite, canCreateMore, maxSites }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  const isPro = profile?.plan === "pro";
  const hasSites = sites.length > 0;
  const hasMultipleSites = sites.length > 1;

  const handleSiteChange = async (siteId: string) => {
    // Set cookie for active site
    document.cookie = `active_site_id=${siteId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setSiteDropdownOpen(false);
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-dark-800 lg:bg-dark-900/50">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-6 border-b border-dark-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          <BrickWall className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold">BrickProfile</span>
      </div>

      {/* Site Selector (for multiple sites) */}
      {hasSites && (
        <div className="px-3 py-3 border-b border-dark-800">
          <div className="relative">
            <button
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-colors"
            >
              <span className="text-sm font-medium truncate">
                {activeSite?.company_name || "Select Site"}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 text-dark-400 transition-transform",
                siteDropdownOpen && "rotate-180"
              )} />
            </button>

            {siteDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-lg z-50 py-1">
                {sites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => handleSiteChange(site.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-dark-700 transition-colors"
                  >
                    {site.id === activeSite?.id && (
                      <Check className="w-4 h-4 text-brand-400" />
                    )}
                    <span className={cn(
                      "truncate",
                      site.id !== activeSite?.id && "ml-6"
                    )}>
                      {site.company_name}
                    </span>
                    {site.is_published ? (
                      <span className="ml-auto badge-success text-xs">Live</span>
                    ) : (
                      <span className="ml-auto badge-warning text-xs">Draft</span>
                    )}
                  </button>
                ))}

                {/* Create new site */}
                {canCreateMore && (
                  <>
                    <div className="border-t border-dark-700 my-1" />
                    <Link
                      href="/onboarding"
                      onClick={() => setSiteDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-brand-400 hover:bg-dark-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Site
                    </Link>
                  </>
                )}
                {!canCreateMore && !isPro && (
                  <>
                    <div className="border-t border-dark-700 my-1" />
                    <Link
                      href="/upgrade"
                      onClick={() => setSiteDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-dark-400 hover:bg-dark-700 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span>Upgrade for more sites</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          {isPro && (
            <p className="text-xs text-dark-500 mt-2 px-1">
              {sites.length}/{maxSites} sites
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Onboarding link if no site */}
        {!hasSites && (
          <Link
            href="/onboarding"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/onboarding"
                ? "bg-brand-500/10 text-brand-400"
                : "text-dark-400 hover:text-dark-100 hover:bg-dark-800"
            )}
          >
            <Sparkles className="w-5 h-5" />
            Create Website
          </Link>
        )}

        {/* Main navigation */}
        {hasSites &&
          navigation.map((item) => {
            const isActive = pathname === item.href;
            const showProBadge = (item as any).pro && !isPro;
            const isHighlight = (item as any).highlight;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-500/10 text-brand-400"
                    : isHighlight
                    ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    : "text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                )}
              >
                <item.icon className={cn("w-5 h-5", isHighlight && !isActive && "text-amber-400")} />
                {item.name}
                {isHighlight && !isActive && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">NEW</span>
                )}
                {showProBadge && (
                  <span className="ml-auto badge-primary text-xs">Pro</span>
                )}
              </Link>
            );
          })}
      </nav>

      {/* Site status */}
      {activeSite && (
        <div className="px-3 py-4 border-t border-dark-800">
          <div className="p-3 rounded-lg bg-dark-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium truncate">
                {activeSite.company_name}
              </span>
              {activeSite.is_published ? (
                <span className="badge-success">Live</span>
              ) : (
                <span className="badge-warning">Draft</span>
              )}
            </div>
            <Link
              href={`/site/${activeSite.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-dark-400 hover:text-brand-400 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {activeSite.slug}.brickprofile.com
            </Link>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {!isPro && (
        <div className="px-3 py-4 border-t border-dark-800">
          <Link
            href="/upgrade"
            className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-brand-600/20 to-brand-500/20 border border-brand-500/30 hover:border-brand-500/50 transition-colors"
          >
            <Crown className="w-5 h-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium">Upgrade to Pro</p>
              <p className="text-xs text-dark-400">$19.99/month</p>
            </div>
          </Link>
        </div>
      )}

      {/* User info */}
      <div className="px-3 py-4 border-t border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-sm font-medium">
            {user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.email}</p>
            <p className="text-xs text-dark-500">
              {isPro ? "Pro Plan" : "Free Plan"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
