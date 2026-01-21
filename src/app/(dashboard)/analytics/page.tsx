import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile for plan check
  const { data: profile } = await supabase
    .from("ps_profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPro = profile?.plan === "pro";

  // Get user's site
  const { data: site } = await supabase
    .from("ps_sites")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!site) {
    redirect("/onboarding");
  }

  // Get analytics data (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: analytics } = await supabase
    .from("ps_analytics")
    .select("*")
    .eq("site_id", site.id)
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: true });

  // Calculate totals
  const totals = (analytics || []).reduce(
    (acc, day) => ({
      pageViews: acc.pageViews + (day.page_views || 0),
      uniqueVisitors: acc.uniqueVisitors + (day.unique_visitors || 0),
      quoteClicks: acc.quoteClicks + (day.quote_clicks || 0),
      phoneClicks: acc.phoneClicks + (day.phone_clicks || 0),
    }),
    { pageViews: 0, uniqueVisitors: 0, quoteClicks: 0, phoneClicks: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-dark-400">
          Track your portfolio&apos;s performance and visitor engagement.
        </p>
      </div>

      {!isPro ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Unlock Full Analytics
          </h2>
          <p className="text-dark-400 max-w-md mx-auto mb-8">
            Get detailed insights into your portfolio&apos;s performance including
            visitor trends, engagement metrics, and conversion tracking.
          </p>

          {/* Basic stats preview */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="p-4 rounded-lg bg-dark-800/50">
              <p className="text-3xl font-bold">{totals.pageViews}</p>
              <p className="text-sm text-dark-400">Total Views</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-800/50 opacity-50">
              <p className="text-3xl font-bold">?</p>
              <p className="text-sm text-dark-400">More Stats</p>
            </div>
          </div>

          <Link href="/upgrade" className="btn-primary btn-lg">
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Pro
          </Link>
        </div>
      ) : (
        <AnalyticsDashboard analytics={analytics || []} totals={totals} />
      )}
    </div>
  );
}
