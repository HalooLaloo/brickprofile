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
    .select("company_name, headline, about_text")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!site) {
    return {
      title: "Site Not Found - BrickProfile",
    };
  }

  return {
    title: `${site.company_name} - Portfolio`,
    description: site.headline || site.about_text?.slice(0, 160),
    openGraph: {
      title: site.company_name,
      description: site.headline || "Professional contractor portfolio",
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
