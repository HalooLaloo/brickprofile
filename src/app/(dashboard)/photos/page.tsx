import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { PhotosManager } from "@/components/photos/PhotosManager";
import { PLAN_LIMITS } from "@/lib/types";

export default async function PhotosPage() {
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
      .select("id")
      .eq("id", activeSiteId)
      .eq("user_id", user.id)
      .single();
    site = data;
  }

  // If no active site or not found, get first site
  if (!site) {
    const { data } = await supabase
      .from("ps_sites")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    site = data;
  }

  if (!site) {
    redirect("/onboarding");
  }

  // Get photos
  const { data: photos } = await supabase
    .from("ps_photos")
    .select("*")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true });

  // Get profile for plan limits
  const { data: profile } = await supabase
    .from("ps_profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPro = profile?.plan === "pro";
  const maxPhotos = isPro ? PLAN_LIMITS.pro.maxPhotos : PLAN_LIMITS.free.maxPhotos;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Photos</h1>
        <p className="text-dark-400">
          Manage your portfolio photos. {!isPro && `Free plan: ${photos?.length || 0}/${maxPhotos} photos.`}
        </p>
      </div>

      <PhotosManager
        initialPhotos={photos || []}
        maxPhotos={maxPhotos}
        isPro={isPro}
        siteId={site.id}
      />
    </div>
  );
}
