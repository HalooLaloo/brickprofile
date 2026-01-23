"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { TemplateProps } from "@/lib/types";

export function MinimalTemplate({ site, photos, reviews }: TemplateProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const primaryColor = site.primary_color || "#3b82f6";

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
              href={`${process.env.NEXT_PUBLIC_QUOTESNAP_URL}/request/${site.quotesnap_user_id}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border border-dark-600 hover:border-white rounded"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(index)}
                  className="aspect-square overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Simple quotes */}
      {reviews.length > 0 && (
        <section className="py-16 px-6 border-t border-dark-800/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-medium text-dark-500 uppercase tracking-wide mb-8">
              Reviews
            </h2>
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
          </div>
        </section>
      )}

      {/* Contact - Minimal */}
      <section className="py-24 px-6 border-t border-dark-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-medium text-dark-500 uppercase tracking-wide mb-8">
            Contact
          </h2>
          <div className="space-y-4">
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="block text-2xl hover:text-dark-300 transition-colors"
              >
                {site.phone}
              </a>
            )}
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="block text-2xl hover:text-dark-300 transition-colors"
              >
                {site.email}
              </a>
            )}
            {site.address && (
              <p className="text-dark-500">{site.address}</p>
            )}
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
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-dark-950 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1
              );
            }}
            className="absolute left-6 text-dark-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-6xl px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedPhoto].url}
              alt={photos[selectedPhoto].caption || ""}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {photos[selectedPhoto].caption && (
              <p className="text-center mt-6 text-dark-500">
                {photos[selectedPhoto].caption}
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0
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
