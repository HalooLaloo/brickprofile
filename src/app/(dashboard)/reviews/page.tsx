import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ReviewsManager } from "@/components/reviews/ReviewsManager";
import { GoogleReviewsLink } from "@/components/reviews/GoogleReviewsLink";
import { PLAN_LIMITS } from "@/lib/types";

export default async function ReviewsPage() {
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
      .select("id, google_reviews_url")
      .eq("id", activeSiteId)
      .eq("user_id", user.id)
      .single();
    site = data;
  }

  // If no active site or not found, get first site
  if (!site) {
    const { data } = await supabase
      .from("ps_sites")
      .select("id, google_reviews_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    site = data;
  }

  if (!site) {
    redirect("/onboarding");
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from("ps_reviews")
    .select("*")
    .eq("site_id", site.id)
    .order("created_at", { ascending: false });

  // Get profile for plan limits
  const { data: profile } = await supabase
    .from("ps_profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPro = profile?.plan === "pro";
  const maxReviews = isPro ? PLAN_LIMITS.pro.maxReviews : PLAN_LIMITS.free.maxReviews;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Reviews & Testimonials</h1>
        <p className="text-dark-400">
          Add customer reviews to build trust with potential clients.
          {!isPro && ` Free plan: ${reviews?.length || 0}/${maxReviews} reviews.`}
        </p>
      </div>

      {/* Google Reviews Link (Pro feature) */}
      <GoogleReviewsLink
        siteId={site.id}
        initialUrl={site.google_reviews_url}
        isPro={isPro}
      />

      <ReviewsManager
        initialReviews={reviews || []}
        maxReviews={maxReviews}
        isPro={isPro}
        siteId={site.id}
      />
    </div>
  );
}
