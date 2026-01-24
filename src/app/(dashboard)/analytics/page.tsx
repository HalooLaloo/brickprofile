import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";

// Generate sample analytics data for preview
function generateSampleAnalytics() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      id: `sample-${i}`,
      site_id: "sample",
      date: date.toISOString().split("T")[0],
      page_views: Math.floor(50 + Math.random() * 100 + (29 - i) * 2),
      unique_visitors: Math.floor(25 + Math.random() * 50 + (29 - i)),
      quote_clicks: Math.floor(Math.random() * 5),
      phone_clicks: Math.floor(Math.random() * 8),
    });
  }
  return data;
}

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
        <div className="relative">
          {/* Blurred preview of full dashboard with sample data */}
          <div className="blur-sm pointer-events-none select-none">
            <AnalyticsDashboard
              analytics={generateSampleAnalytics()}
              totals={{ pageViews: 2847, uniqueVisitors: 1423, quoteClicks: 89, phoneClicks: 156 }}
            />
          </div>

          {/* Overlay with upgrade CTA */}
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 backdrop-blur-[2px]">
            <div className="card p-8 max-w-md text-center bg-gradient-to-br from-dark-800 to-dark-900 border-amber-500/30">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Unlock Full Analytics
              </h2>
              <p className="text-dark-400 text-sm mb-6">
                See detailed visitor trends, engagement metrics, quote requests, and phone clicks to understand how your portfolio performs.
              </p>

              {/* Mini preview of real stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-dark-700/50">
                  <p className="text-2xl font-bold">{totals.pageViews}</p>
                  <p className="text-xs text-dark-400">Your Views</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-700/50 relative overflow-hidden">
                  <div className="blur-sm">
                    <p className="text-2xl font-bold">{totals.uniqueVisitors}</p>
                    <p className="text-xs text-dark-400">Visitors</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-dark-500" />
                  </div>
                </div>
              </div>

              <Link href="/upgrade" className="btn-primary btn-md w-full bg-amber-500 hover:bg-amber-600">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro - $19.99/mo
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <AnalyticsDashboard analytics={analytics || []} totals={totals} />
      )}
    </div>
  );
}
