"use client";

import { Eye, Users, MessageSquare, Phone, TrendingUp } from "lucide-react";
import type { Analytics } from "@/lib/types";

interface AnalyticsDashboardProps {
  analytics: Analytics[];
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    quoteClicks: number;
    phoneClicks: number;
  };
}

export function AnalyticsDashboard({
  analytics,
  totals,
}: AnalyticsDashboardProps) {
  // Calculate trend (compare last 7 days to previous 7 days)
  const last7Days = analytics.slice(-7);
  const previous7Days = analytics.slice(-14, -7);

  const last7Total = last7Days.reduce((sum, d) => sum + d.page_views, 0);
  const prev7Total = previous7Days.reduce((sum, d) => sum + d.page_views, 0);
  const trend = prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total) * 100 : 0;

  // Find max value for chart scaling
  const maxViews = Math.max(...analytics.map((d) => d.page_views), 1);

  const stats = [
    {
      label: "Total Page Views",
      value: totals.pageViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Unique Visitors",
      value: totals.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Quote Requests",
      value: totals.quoteClicks.toLocaleString(),
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Phone Clicks",
      value: totals.phoneClicks.toLocaleString(),
      icon: Phone,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-dark-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trend Card */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Weekly Trend</h3>
          <div
            className={`flex items-center gap-1 text-sm ${
              trend >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
        <p className="text-sm text-dark-400">
          {trend >= 0
            ? "Your views are up compared to last week!"
            : "Your views are down compared to last week."}
        </p>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <h3 className="font-semibold mb-6">Page Views (Last 30 Days)</h3>
        <div className="h-64">
          {analytics.length > 0 ? (
            <div className="flex items-end justify-between h-full gap-1">
              {analytics.map((day, i) => {
                const height = (day.page_views / maxViews) * 100;
                return (
                  <div
                    key={day.id || i}
                    className="flex-1 flex flex-col items-center justify-end group"
                  >
                    <div className="relative w-full">
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-dark-800 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        : {day.page_views} views
                      </div>
                      {/* Bar */}
                      <div
                        className="w-full bg-brand-500/60 hover:bg-brand-500 rounded-t transition-colors"
                        style={{
                          height: `${Math.max(height, 2)}%`,
                          minHeight: "4px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-dark-500">
              <p>No data available yet. Views will appear here.</p>
            </div>
          )}
        </div>

        {/* X-axis labels */}
        {analytics.length > 0 && (
          <div className="flex justify-between mt-2 text-xs text-dark-500">
            <span>
              {new Date(analytics[0]?.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>
              {new Date(analytics[analytics.length - 1]?.date).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analytics
            .slice(-7)
            .reverse()
            .map((day, i) => (
              <div
                key={day.id || i}
                className="flex items-center justify-between py-2 border-b border-dark-800/50 last:border-0"
              >
                <span className="text-dark-400">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-blue-400" />
                    {day.page_views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-400" />
                    {day.unique_visitors}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
