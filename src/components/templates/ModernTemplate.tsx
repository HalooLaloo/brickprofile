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
  MessageSquare,
} from "lucide-react";
import type { TemplateProps, Photo } from "@/lib/types";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export function ModernTemplate({ site, photos, reviews }: TemplateProps) {
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            {site.company_name}
          </span>
          <div className="flex items-center gap-4">
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="hidden sm:flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {site.phone}
              </a>
            )}
            {site.show_quote_button && site.quotesnap_user_id && (
              <a
                href={`${process.env.NEXT_PUBLIC_QUOTESNAP_URL}/request/${site.quotesnap_user_id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Get a Quote
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero - Full screen with gradient */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${primaryColor}40 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${primaryColor}20 0%, transparent 50%)`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p
            className="text-sm font-medium tracking-widest uppercase mb-4"
            style={{ color: primaryColor }}
          >
            {site.service_areas?.slice(0, 2).join(" & ")}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {site.headline || site.company_name}
          </h1>
          {site.services && (site.services as { name: string }[]).length > 0 && (
            <p className="text-xl text-dark-400 mb-8">
              {(site.services as { name: string }[])
                .slice(0, 4)
                .map((s) => s.name)
                .join(" • ")}
            </p>
          )}
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium text-white transition-all hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            View Our Work
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* About - Split layout */}
      {site.about_text && (
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm font-medium tracking-widest uppercase mb-4"
                style={{ color: primaryColor }}
              >
                About Us
              </p>
              <h2 className="text-4xl font-bold mb-6">
                Building Excellence Since Day One
              </h2>
              <div className="space-y-4 text-dark-300 text-lg">
                {site.about_text.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {photos.slice(0, 4).map((photo, i) => (
                  <div
                    key={photo.id}
                    className={`rounded-2xl overflow-hidden ${
                      i === 0 ? "col-span-2 aspect-video" : "aspect-square"
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Services - Cards with hover */}
      {site.services && (site.services as { name: string; description: string }[]).length > 0 && (
        <section className="py-32 px-6 bg-dark-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-sm font-medium tracking-widest uppercase mb-4"
                style={{ color: primaryColor }}
              >
                What We Do
              </p>
              <h2 className="text-4xl font-bold">Our Services</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(site.services as { name: string; description: string }[]).map((service, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-3xl bg-dark-800/30 border border-dark-700/50 hover:border-dark-600 transition-all hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                  {service.description && (
                    <p className="text-dark-400">{service.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio - Masonry style */}
      {photos.length > 0 && (
        <section id="work" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-sm font-medium tracking-widest uppercase mb-4"
                style={{ color: primaryColor }}
              >
                Portfolio
              </p>
              <h2 className="text-4xl font-bold">Featured Projects</h2>
            </div>

            {/* Before/After Transformations */}
            {beforeAfterPairs.length > 0 && (
              <div className="mb-16">
                <h3 className="text-xl font-semibold text-center mb-8 text-dark-300">
                  Transformations
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {beforeAfterPairs.map((pair, index) => (
                    <div key={pair.before.pair_id || index}>
                      <BeforeAfterSlider
                        beforeImage={pair.before.url}
                        afterImage={pair.after.url}
                        beforeLabel="Before"
                        afterLabel="After"
                        className="rounded-2xl"
                      />
                      {(pair.before.caption || pair.after.caption) && (
                        <p className="text-sm text-dark-400 mt-3 text-center">
                          {pair.after.caption || pair.before.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regularPhotos.length > 0 && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {regularPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(index)}
                    className="w-full rounded-2xl overflow-hidden hover:opacity-90 transition-opacity break-inside-avoid"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "Portfolio photo"}
                      className="w-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials - Large quotes */}
      {reviews.length > 0 && (
        <section className="py-32 px-6 bg-dark-900/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-sm font-medium tracking-widest uppercase mb-4"
                style={{ color: primaryColor }}
              >
                Testimonials
              </p>
              <h2 className="text-4xl font-bold">Client Reviews</h2>
            </div>
            <div className="space-y-8">
              {reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="p-8 rounded-3xl bg-dark-800/30 border border-dark-700/50"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-dark-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-2xl text-dark-200 mb-6 leading-relaxed">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{review.client_name}</p>
                      <p className="text-sm text-dark-500">
                        {review.client_location}
                      </p>
                    </div>
                    {review.project_type && (
                      <span
                        className="text-sm px-4 py-1.5 rounded-full"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor,
                        }}
                      >
                        {review.project_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact - Minimal */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-sm font-medium tracking-widest uppercase mb-4"
            style={{ color: primaryColor }}
          >
            Contact
          </p>
          <h2 className="text-4xl font-bold mb-4">Let&apos;s Work Together</h2>
          <p className="text-xl text-dark-400 mb-12">
            Ready to start your project? Get in touch today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-3 px-8 py-4 rounded-full border border-dark-700 hover:border-dark-600 transition-colors"
              >
                <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                {site.phone}
              </a>
            )}
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 px-8 py-4 rounded-full border border-dark-700 hover:border-dark-600 transition-colors"
              >
                <Mail className="w-5 h-5" style={{ color: primaryColor }} />
                {site.email}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-dark-800/50 text-center text-sm text-dark-500">
        <p>
          &copy; {new Date().getFullYear()} {site.company_name} • Powered by{" "}
          <a href="https://brickprofile.com" className="hover:text-white transition-colors">
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
            className="absolute left-4 p-3 rounded-full bg-dark-800 hover:bg-dark-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={regularPhotos[selectedPhoto].url}
              alt={regularPhotos[selectedPhoto].caption || ""}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto < regularPhotos.length - 1 ? selectedPhoto + 1 : 0
              );
            }}
            className="absolute right-4 p-3 rounded-full bg-dark-800 hover:bg-dark-700"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
