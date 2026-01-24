"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Clock,
  MessageSquare,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { TemplateProps, Photo } from "@/lib/types";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ContactForm } from "./ContactForm";
import { WatermarkedPhoto } from "@/components/ui/WatermarkedPhoto";

export function MinimalTemplate({ site, photos, reviews }: TemplateProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const primaryColor = site.primary_color || "#3b82f6";

  // Separate before/after pairs from regular photos
  const { beforeAfterPairs, regularPhotos } = useMemo(() => {
    const pairs: { before: Photo; after: Photo }[] = [];
    const regular: Photo[] = [];
    const processedPairIds = new Set<string>();

    photos.forEach((photo) => {
      if (photo.is_before_after && photo.pair_id) {
        if (!processedPairIds.has(photo.pair_id)) {
          const pairedPhoto = photos.find(
            (p) => p.pair_id === photo.pair_id && p.id !== photo.id
          );
          if (pairedPhoto) {
            const beforePhoto = photo.is_before ? photo : pairedPhoto;
            const afterPhoto = photo.is_before ? pairedPhoto : photo;
            pairs.push({ before: beforePhoto, after: afterPhoto });
            processedPairIds.add(photo.pair_id);
          }
        }
      } else if (!photo.is_before_after) {
        regular.push(photo);
      }
    });

    return { beforeAfterPairs: pairs, regularPhotos: regular };
  }, [photos]);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Simple header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="font-medium">{site.company_name}</span>
          {site.phone && (
            <a
              href={`tel:${site.phone}`}
              className="text-sm text-dark-400 hover:text-white transition-colors"
            >
              {site.phone}
            </a>
          )}
        </div>
      </header>

      {/* Hero - Clean and simple */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
            {site.headline || site.company_name}
          </h1>
          {site.service_areas && site.service_areas.length > 0 && (
            <p className="text-dark-400 mb-6">
              Serving {site.service_areas.join(", ")}
            </p>
          )}
          {site.show_quote_button && site.quotesnap_user_id && (
            <a
              href={`https://brickquote.app/request/${site.quotesnap_user_id}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border border-dark-600 hover:border-white rounded"
            >
              <Sparkles className="w-4 h-4" />
              Get AI Quote
            </a>
          )}
        </div>
      </section>

      {/* About */}
      {site.about_text && (
        <section className="py-16 px-6 border-t border-dark-800/50">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 text-lg text-dark-300 leading-relaxed">
              {site.about_text.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services - Simple list */}
      {site.services && (site.services as { name: string; description: string }[]).length > 0 && (
        <section className="py-16 px-6 border-t border-dark-800/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-medium text-dark-500 uppercase tracking-wide mb-8">
              Services
            </h2>
            <div className="space-y-6">
              {(site.services as { name: string; description: string }[]).map((service, i) => (
                <div
                  key={i}
                  className="group flex items-start justify-between py-4 border-b border-dark-800/50"
                >
                  <div>
                    <h3 className="font-medium mb-1">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-dark-500">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-dark-600 group-hover:text-white transition-colors mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio - Clean grid */}
      {photos.length > 0 && (
        <section className="py-16 px-6 border-t border-dark-800/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-medium text-dark-500 uppercase tracking-wide mb-8">
              Work
            </h2>

            {/* Before/After Transformations */}
            {beforeAfterPairs.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wide mb-6">
                  Transformations
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {beforeAfterPairs.map((pair, index) => (
                    <div key={pair.before.pair_id || index}>
                      <BeforeAfterSlider
                        beforeImage={pair.before.url}
                        afterImage={pair.after.url}
                        beforeLabel="Before"
                        afterLabel="After"
                      />
                      {(pair.before.caption || pair.after.caption) && (
                        <p className="text-sm text-dark-500 mt-2 text-center">
                          {pair.after.caption || pair.before.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regularPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {regularPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(index)}
                    className="aspect-square overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <WatermarkedPhoto
                      src={photo.url}
                      alt={photo.caption || ""}
                      companyName={site.company_name}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials - Simple quotes */}
      {(reviews.length > 0 || site.google_reviews_url) && (
        <section className="py-16 px-6 border-t border-dark-800/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-medium text-dark-500 uppercase tracking-wide mb-8">
              Reviews
            </h2>

            {/* Google Reviews Button */}
            {site.google_reviews_url && (
              <div className="mb-12">
                <a
                  href={site.google_reviews_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:text-dark-300 transition-colors"
                  style={{ color: primaryColor }}
                >
                  <Star className="w-4 h-4" />
                  View our Google Reviews
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {reviews.length > 0 && (
            <div className="space-y-12">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id}>
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-dark-300 fill-dark-300"
                            : "text-dark-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-lg text-dark-200 mb-4 leading-relaxed">
                    &quot;{review.text}&quot;
                  </p>
                  <p className="text-sm text-dark-500">
                    — {review.client_name}
                    {review.client_location && `, ${review.client_location}`}
                  </p>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-24 px-6 border-t border-dark-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium text-dark-500 uppercase tracking-wide mb-12">
            Contact
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left - BrickQuote + Contact Info */}
            <div className="space-y-8">
              {/* BrickQuote */}
              {site.show_quote_button && site.quotesnap_user_id && (
                <div className="p-6 border border-dark-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                    <span className="font-medium">Get AI Quote</span>
                  </div>
                  <p className="text-sm text-dark-400 mb-4">
                    Instant estimate powered by AI. Describe your project and get a quote in minutes.
                  </p>
                  <a
                    href={`https://brickquote.app/request/${site.quotesnap_user_id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm hover:text-dark-300 transition-colors"
                    style={{ color: primaryColor }}
                  >
                    Start AI Quote
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-4">
                {site.phone && (
                  <a
                    href={`tel:${site.phone}`}
                    className="block text-xl hover:text-dark-300 transition-colors"
                  >
                    {site.phone}
                  </a>
                )}
                {site.email && (
                  <a
                    href={`mailto:${site.email}`}
                    className="block text-xl hover:text-dark-300 transition-colors"
                  >
                    {site.email}
                  </a>
                )}
                {site.address && (
                  <p className="text-dark-500">{site.address}</p>
                )}
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="bg-white rounded-lg p-6 text-dark-900">
              <h3 className="font-medium mb-4">Send a message</h3>
              <ContactForm
                siteId={site.id}
                primaryColor={primaryColor}
                services={site.services as { name: string; description?: string }[] || []}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-dark-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm text-dark-600">
          <p>&copy; {new Date().getFullYear()} {site.company_name}</p>
          <a href="https://brickprofile.com" className="hover:text-dark-400">
            BrickProfile
          </a>
        </div>
      </footer>

      {/* Lightbox */}
      {selectedPhoto !== null && regularPhotos[selectedPhoto] && (
        <div
          className="fixed inset-0 z-50 bg-dark-950 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto > 0 ? selectedPhoto - 1 : regularPhotos.length - 1
              );
            }}
            className="absolute left-6 text-dark-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-6xl px-16" onClick={(e) => e.stopPropagation()}>
            <WatermarkedPhoto
              src={regularPhotos[selectedPhoto].url}
              alt={regularPhotos[selectedPhoto].caption || ""}
              companyName={site.company_name}
              className="max-w-full max-h-[90vh]"
            />
            {regularPhotos[selectedPhoto].caption && (
              <p className="text-center mt-6 text-dark-500">
                {regularPhotos[selectedPhoto].caption}
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto < regularPhotos.length - 1 ? selectedPhoto + 1 : 0
              );
            }}
            className="absolute right-6 text-dark-500 hover:text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
