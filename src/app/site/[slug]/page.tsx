import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { DEMO_SITE, DEMO_PHOTOS, DEMO_REVIEWS } from "@/lib/demo-data";
import type { Site, Photo, Review } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Handle demo site
  if (slug === "demo") {
    return {
      title: `${DEMO_SITE.company_name} | Professional Portfolio`,
      description: DEMO_SITE.headline || "Professional contractor portfolio",
      openGraph: {
        title: DEMO_SITE.company_name,
        description: DEMO_SITE.headline || "Professional contractor portfolio",
        siteName: "BrickProfile",
        type: "website",
        images: [{ url: DEMO_PHOTOS[0].url, width: 1200, height: 630 }],
      },
    };
  }

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

  // Generate dynamic OG image URL
  const ogImageUrl = new URL("/api/og", "https://brickprofile.com");
  ogImageUrl.searchParams.set("title", site.company_name);
  if (site.headline) {
    ogImageUrl.searchParams.set("subtitle", site.headline);
  } else if (serviceAreas) {
    ogImageUrl.searchParams.set("subtitle", `Serving ${serviceAreas}`);
  }
  if (firstPhoto) {
    ogImageUrl.searchParams.set("image", firstPhoto);
  }

  return {
    title: `${site.company_name} | Professional Portfolio`,
    description,
    openGraph: {
      title: site.company_name,
      description,
      siteName: "BrickProfile",
      type: "website",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${site.company_name} - Professional Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.company_name,
      description,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function PortfolioSitePage({ params }: Props) {
  const { slug } = await params;

  // Handle demo site with static data
  if (slug === "demo") {
    const templateProps = {
      site: DEMO_SITE,
      photos: DEMO_PHOTOS,
      reviews: DEMO_REVIEWS,
      isPreview: true,
    };

    // Demo uses modern template
    return <ModernTemplate {...templateProps} />;
  }

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

  // Build site URL for JSON-LD
  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `https://brickprofile.com/site/${slug}`;

  const jsonLd = (
    <LocalBusinessJsonLd
      site={site as Site}
      reviews={(reviews || []) as Review[]}
      url={siteUrl}
    />
  );

  switch (site.template) {
    case "modern":
      return (
        <>
          {jsonLd}
          <ModernTemplate {...templateProps} />
        </>
      );
    case "bold":
      return (
        <>
          {jsonLd}
          <BoldTemplate {...templateProps} />
        </>
      );
    case "minimal":
      return (
        <>
          {jsonLd}
          <MinimalTemplate {...templateProps} />
        </>
      );
    case "classic":
    default:
      return (
        <>
          {jsonLd}
          <ClassicTemplate {...templateProps} />
        </>
      );
  }
}
