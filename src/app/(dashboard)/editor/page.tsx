import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { EditorForm } from "@/components/editor/EditorForm";

export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get active site from cookie
  const cookieStore = await cookies();
  const activeSiteId = cookieStore.get("active_site_id")?.value;

  // Get user's site(s)
  let site;
  if (activeSiteId) {
    const { data } = await supabase
      .from("ps_sites")
      .select("*")
      .eq("id", activeSiteId)
      .eq("user_id", user.id)
      .single();
    site = data;
  }

  // If no active site or not found, get first site
  if (!site) {
    const { data } = await supabase
      .from("ps_sites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    site = data;
  }

  if (!site) {
    redirect("/onboarding");
  }

  // Get profile for plan info
  const { data: profile } = await supabase
    .from("ps_profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Edit Website</h1>
        <p className="text-dark-400">
          Customize your portfolio website content and settings.
        </p>
      </div>

      <EditorForm site={site} isPro={profile?.plan === "pro"} />
    </div>
  );
}
