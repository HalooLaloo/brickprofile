"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
} from "lucide-react";
import type { TemplateProps, Photo } from "@/lib/types";
import { ContactForm } from "./ContactForm";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export function ClassicTemplate({ site, photos, reviews }: TemplateProps) {
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

  // Group photos by category
  const categories = Array.from(new Set(regularPhotos.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur border-b border-dark-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{site.company_name}</h1>
              {site.service_areas && site.service_areas.length > 0 && (
                <p className="text-sm text-dark-400">
                  Serving {site.service_areas.slice(0, 3).join(", ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {site.phone && (
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">{site.phone}</span>
                </a>
              )}
              {site.show_quote_button && site.quotesnap_user_id && (
                <a
                  href={`${process.env.NEXT_PUBLIC_QUOTESNAP_URL}/request/${site.quotesnap_user_id}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Get Quote
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="py-20 px-4"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15, transparent)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {site.headline || `Welcome to ${site.company_name}`}
          </h2>
          {site.services && site.services.length > 0 && (
            <p className="text-xl text-dark-300">
              {(site.services as { name: string }[]).map((s) => s.name).join(" • ")}
            </p>
          )}
        </div>
      </section>

      {/* About */}
      {site.about_text && (
        <section className="py-16 px-4 border-t border-dark-800">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">About Us</h3>
            <div className="prose prose-invert max-w-none">
              {site.about_text.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-dark-300 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {site.services && (site.services as { name: string; description: string }[]).length > 0 && (
        <section className="py-16 px-4 bg-dark-900/50 border-t border-dark-800">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Our Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(site.services as { name: string; description: string }[]).map((service, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-dark-800/50 border border-dark-700"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <Check className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <h4 className="font-semibold mb-2">{service.name}</h4>
                  {service.description && (
                    <p className="text-sm text-dark-400">{service.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio */}
      {photos.length > 0 && (
        <section className="py-16 px-4 border-t border-dark-800">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Our Work</h3>

            {/* Before/After Transformations */}
            {beforeAfterPairs.length > 0 && (
              <div className="mb-12">
                <h4 className="text-lg font-semibold mb-6 text-center text-dark-300">
                  Transformations
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {beforeAfterPairs.map((pair, index) => (
                    <div key={pair.before.pair_id || index}>
                      <BeforeAfterSlider
                        beforeImage={pair.before.url}
                        afterImage={pair.after.url}
                        beforeLabel="Before"
                        afterLabel="After"
                        className="rounded-xl"
                      />
                      {(pair.before.caption || pair.after.caption) && (
                        <p className="text-sm text-dark-400 mt-2 text-center">
                          {pair.after.caption || pair.before.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category filters */}
            {categories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full text-sm bg-dark-800 text-dark-300 capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Photo grid */}
            {regularPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {regularPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(index)}
                    className="aspect-square rounded-xl overflow-hidden bg-dark-800 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "Portfolio photo"}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reviews */}
      {(reviews.length > 0 || site.google_reviews_url) && (
        <section className="py-16 px-4 bg-dark-900/50 border-t border-dark-800">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">
              What Our Clients Say
            </h3>

            {/* Google Reviews Button */}
            {site.google_reviews_url && (
              <div className="text-center mb-8">
                <a
                  href={site.google_reviews_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Star className="w-5 h-5 fill-current" />
                  View Our Google Reviews
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {reviews.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-xl bg-dark-800/50 border border-dark-700"
                >
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-dark-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-dark-300 mb-4">&quot;{review.text}&quot;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.client_name}</p>
                      {review.client_location && (
                        <p className="text-sm text-dark-500">
                          {review.client_location}
                        </p>
                      )}
                    </div>
                    {review.project_type && (
                      <span className="text-xs px-2 py-1 rounded-full bg-dark-700 text-dark-300">
                        {review.project_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 px-4 border-t border-dark-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">Get In Touch</h3>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <p className="text-dark-300">
                Ready to start your project? Get in touch with us today for a free consultation.
              </p>

              <div className="space-y-4">
                {site.phone && (
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                    {site.phone}
                  </a>
                )}
                {site.email && (
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                  >
                    <Mail className="w-5 h-5" style={{ color: primaryColor }} />
                    {site.email}
                  </a>
                )}
                {site.address && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800">
                    <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
                    {site.address}
                  </div>
                )}
              </div>

              {/* Social links */}
              {(site.facebook_url || site.instagram_url) && (
                <div className="flex gap-4">
                  {site.facebook_url && (
                    <a
                      href={site.facebook_url}
                      target="_blank"
                      className="p-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {site.instagram_url && (
                    <a
                      href={site.instagram_url}
                      target="_blank"
                      className="p-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl p-6 text-dark-900">
              <h4 className="font-semibold text-lg mb-4">Send us a message</h4>
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
      <footer className="py-8 px-4 border-t border-dark-800 text-center text-sm text-dark-500">
        <p>&copy; {new Date().getFullYear()} {site.company_name}. All rights reserved.</p>
        <p className="mt-2">
          Powered by{" "}
          <a href="https://brickprofile.com" className="hover:text-dark-300">
            BrickProfile
          </a>
        </p>
      </footer>

      {/* Lightbox */}
      {selectedPhoto !== null && regularPhotos[selectedPhoto] && (
        <div
          className="fixed inset-0 z-50 bg-dark-950/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto > 0 ? selectedPhoto - 1 : regularPhotos.length - 1
              );
            }}
            className="absolute left-4 p-2 rounded-full bg-dark-800 hover:bg-dark-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={regularPhotos[selectedPhoto].url}
              alt={regularPhotos[selectedPhoto].caption || "Portfolio photo"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {regularPhotos[selectedPhoto].caption && (
              <p className="text-center mt-4 text-dark-300">
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
            className="absolute right-4 p-2 rounded-full bg-dark-800 hover:bg-dark-700"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
