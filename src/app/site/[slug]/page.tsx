import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import type { Site, Photo, Review } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("ps_sites")
    .select("id, company_name, headline, about_text, service_areas")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!site) {
    return {
      title: "Site Not Found - BrickProfile",
    };
  }

  // Get first photo for og:image
  const { data: photos } = await supabase
    .from("ps_photos")
    .select("url")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true })
    .limit(1);

  const firstPhoto = photos?.[0]?.url;
  const serviceAreas = Array.isArray(site.service_areas)
    ? site.service_areas.join(", ")
    : site.service_areas;

  const description = site.headline
    ? `${site.headline}${serviceAreas ? ` | Serving ${serviceAreas}` : ""}`
    : site.about_text?.slice(0, 160) || "Professional contractor portfolio";

  return {
    title: `${site.company_name} | Professional Portfolio`,
    description,
    openGraph: {
      title: `${site.company_name}`,
      description,
      siteName: "BrickProfile",
      type: "website",
      ...(firstPhoto && { images: [{ url: firstPhoto, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: firstPhoto ? "summary_large_image" : "summary",
      title: site.company_name,
      description,
      ...(firstPhoto && { images: [firstPhoto] }),
    },
  };
}

export default async function PortfolioSitePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch site data
  const { data: site, error: siteError } = await supabase
    .from("ps_sites")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (siteError || !site) {
    notFound();
  }

  // Fetch photos
  const { data: photos } = await supabase
    .from("ps_photos")
    .select("*")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true });

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("ps_reviews")
    .select("*")
    .eq("site_id", site.id)
    .order("created_at", { ascending: false });

  // Track page view (basic analytics)
  const today = new Date().toISOString().split("T")[0];
  try {
    await supabase.rpc("increment_page_views", {
      p_site_id: site.id,
      p_date: today,
    });
  } catch {
    // Ignore analytics errors
  }

  // Render appropriate template
  const templateProps = {
    site: site as Site,
    photos: (photos || []) as Photo[],
    reviews: (reviews || []) as Review[],
  };

  switch (site.template) {
    case "modern":
      return <ModernTemplate {...templateProps} />;
    case "bold":
      return <BoldTemplate {...templateProps} />;
    case "minimal":
      return <MinimalTemplate {...templateProps} />;
    case "classic":
    default:
      return <ClassicTemplate {...templateProps} />;
  }
}
