"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  Circle,
  Loader2,
  Users,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  is_read: boolean;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ plan: string } | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchProfile();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const markAsRead = async (leadId: string, isRead: boolean) => {
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, isRead }),
      });

      setLeads(
        leads.map((lead) =>
          lead.id === leadId ? { ...lead, is_read: isRead } : lead
        )
      );
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const unreadCount = leads.filter((l) => !l.is_read).length;
  const isPro = profile?.plan === "pro";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-dark-400">
            {leads.length} total • {unreadCount} unread
          </p>
        </div>

        {!isPro && (
          <Link
            href="/upgrade"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium"
          >
            <Crown className="w-4 h-4" />
            Upgrade for email notifications
          </Link>
        )}
      </div>

      {/* Pro feature notice */}
      {!isPro && leads.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-amber-200">
                Get notified instantly!
              </p>
              <p className="text-sm text-amber-300/70">
                Upgrade to Pro to receive email notifications when someone
                contacts you through your portfolio.
              </p>
            </div>
          </div>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-dark-500" />
          <h3 className="text-lg font-medium mb-2">No leads yet</h3>
          <p className="text-dark-400">
            When someone contacts you through your portfolio, they'll appear
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`card p-6 ${
                !lead.is_read ? "border-l-4 border-l-brand-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{lead.name}</h3>
                    {!lead.is_read && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-dark-400 mb-3">
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1 hover:text-dark-200"
                      >
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1 hover:text-dark-200"
                      >
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {lead.message && (
                    <div className="p-3 rounded-lg bg-dark-800/50 text-dark-300 text-sm">
                      <MessageSquare className="w-4 h-4 inline mr-2 text-dark-500" />
                      {lead.message}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => markAsRead(lead.id, !lead.is_read)}
                  className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
                  title={lead.is_read ? "Mark as unread" : "Mark as read"}
                >
                  {lead.is_read ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-dark-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
