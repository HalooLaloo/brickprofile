import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { PLAN_LIMITS } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("ps_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get all user's sites
  const { data: sites } = await supabase
    .from("ps_sites")
    .select("id, slug, is_published, company_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  // Get active site from cookie or use first site
  const cookieStore = await cookies();
  const activeSiteId = cookieStore.get("active_site_id")?.value;

  const activeSite = sites?.find(s => s.id === activeSiteId) || sites?.[0] || null;

  const isPro = profile?.plan === "pro";
  const maxSites = PLAN_LIMITS[isPro ? "pro" : "free"].maxSites;
  const canCreateMore = (sites?.length || 0) < maxSites;

  return (
    <div className="min-h-screen flex">
      <Sidebar
        user={{ email: user.email!, id: user.id }}
        profile={profile}
        sites={sites || []}
        activeSite={activeSite}
        canCreateMore={canCreateMore}
        maxSites={maxSites}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <TopBar user={{ email: user.email!, id: user.id }} site={activeSite} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
