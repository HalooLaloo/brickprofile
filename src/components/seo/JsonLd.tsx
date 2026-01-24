import type { Site, Review } from "@/lib/types";

interface JsonLdProps {
  site: Site;
  reviews?: Review[];
  url: string;
}

export function LocalBusinessJsonLd({ site, reviews = [], url }: JsonLdProps) {
  const aggregateRating =
    reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1),
          reviewCount: reviews.length,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined;

  const reviewsJsonLd = reviews.slice(0, 5).map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.client_name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: review.text,
  }));

  const services = Array.isArray(site.services)
    ? (site.services as { name: string; description?: string }[]).map(
        (s) => s.name
      )
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.company_name,
    description: site.headline || site.about_text?.slice(0, 200),
    url: url,
    ...(site.phone && { telephone: site.phone }),
    ...(site.email && { email: site.email }),
    ...(site.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address,
      },
    }),
    ...(site.service_areas &&
      site.service_areas.length > 0 && {
        areaServed: site.service_areas.map((area) => ({
          "@type": "City",
          name: area,
        })),
      }),
    ...(services.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((service, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service,
          },
          position: index + 1,
        })),
      },
    }),
    ...(aggregateRating && { aggregateRating }),
    ...(reviewsJsonLd.length > 0 && { review: reviewsJsonLd }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
