"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Zap,
  LogOut,
  ExternalLink,
  PenSquare,
  Images,
  Star,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TopBarProps {
  user: { email: string; id: string };
  site: { id: string; slug: string; is_published: boolean; company_name: string } | null;
}

const navigation = [
  { name: "Edit Website", href: "/editor", icon: PenSquare },
  { name: "Photos", href: "/photos", icon: Images },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function TopBar({ user, site }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-dark-800 bg-dark-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">PageSnap</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-30 bg-dark-950 border-t border-dark-800 overflow-y-auto">
          <nav className="px-4 py-6 space-y-2">
            {!site && (
              <Link
                href="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800"
              >
                <Sparkles className="w-5 h-5" />
                Create Website
              </Link>
            )}

            {site &&
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}

            {site && (
              <Link
                href={`/site/${site.slug}`}
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800"
              >
                <ExternalLink className="w-5 h-5" />
                View Live Site
              </Link>
            )}

            <div className="border-t border-dark-800 my-4" />

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-dark-800 w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>

            <div className="px-4 py-3">
              <p className="text-sm text-dark-500">{user.email}</p>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop top bar (minimal) */}
      <header className="hidden lg:flex items-center justify-end h-16 px-6 border-b border-dark-800">
        {site && (
          <div className="flex items-center gap-4">
            <Link
              href={`/site/${site.slug}`}
              target="_blank"
              className="btn-secondary btn-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="btn-ghost btn-sm text-dark-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>
    </>
  );
}
