"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import type { TemplateProps } from "@/lib/types";

export function BoldTemplate({ site, photos, reviews }: TemplateProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const primaryColor = site.primary_color || "#3b82f6";

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header - Bold branding bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight uppercase">
            {site.company_name}
          </span>
          <div className="flex items-center gap-4">
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="hidden md:flex items-center gap-2 text-sm font-medium hover:opacity-80"
              >
                <Phone className="w-4 h-4" />
                {site.phone}
              </a>
            )}
            {site.show_quote_button && site.quotesnap_user_id && (
              <a
                href={`${process.env.NEXT_PUBLIC_QUOTESNAP_URL}/request/${site.quotesnap_user_id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded bg-white text-dark-900 text-sm font-bold hover:bg-dark-100 transition-colors"
              >
                FREE QUOTE
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero - Impactful headline */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none mb-6">
                {site.headline?.split(" ").slice(0, 3).join(" ") ||
                  site.company_name}
              </h1>
              <p className="text-xl text-dark-300 mb-8 max-w-lg">
                {site.about_text?.slice(0, 150)}...
              </p>
              {site.services && (site.services as { name: string }[]).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(site.services as { name: string }[]).slice(0, 4).map((service, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-sm font-bold uppercase tracking-wide rounded"
                      style={{
                        backgroundColor: `${primaryColor}30`,
                        color: primaryColor,
                      }}
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {photos.length > 0 && (
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                  <img
                    src={photos[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-6 -left-6 p-6 rounded-2xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  <p className="text-4xl font-black">
                    {reviews.length > 0
                      ? Math.round(
                          reviews.reduce((sum, r) => sum + r.rating, 0) /
                            reviews.length
                        )
                      : 5}
                  </p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-white fill-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-1">
                    {reviews.length} Reviews
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black">10+</p>
              <p className="text-sm font-medium opacity-80">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-black">{photos.length}+</p>
              <p className="text-sm font-medium opacity-80">Projects Done</p>
            </div>
            <div>
              <p className="text-4xl font-black">{reviews.length}</p>
              <p className="text-sm font-medium opacity-80">Happy Clients</p>
            </div>
            <div>
              <p className="text-4xl font-black">
                {site.service_areas?.length || 1}
              </p>
              <p className="text-sm font-medium opacity-80">Areas Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      {site.services && (site.services as { name: string; description: string }[]).length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-black mb-12">
              WHAT WE <span style={{ color: primaryColor }}>DO</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {(site.services as { name: string; description: string }[]).map((service, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-dark-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className="text-6xl font-black opacity-20"
                        style={{ color: primaryColor }}
                      >
                        0{i + 1}
                      </span>
                      <h3 className="text-2xl font-bold mt-2">{service.name}</h3>
                      {service.description && (
                        <p className="text-dark-400 mt-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: primaryColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio */}
      {photos.length > 0 && (
        <section className="py-24 px-6 bg-dark-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-black mb-12">
              OUR <span style={{ color: primaryColor }}>WORK</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(index)}
                  className="aspect-square rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform"
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

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-black mb-12">
              CLIENT <span style={{ color: primaryColor }}>REVIEWS</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl bg-dark-900 border border-dark-800"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-dark-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-dark-200 mb-6">&quot;{review.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {review.client_name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{review.client_name}</p>
                      <p className="text-sm text-dark-500">
                        {review.project_type || review.client_location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-24 px-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">READY TO START?</h2>
          <p className="text-xl opacity-90 mb-8">
            Contact us today for a free consultation and quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-dark-900 font-bold hover:bg-dark-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {site.phone}
              </a>
            )}
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white font-bold hover:bg-white/10 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {site.email}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-dark-800 text-center text-sm text-dark-500">
        <p>
          &copy; {new Date().getFullYear()} {site.company_name} • Built with{" "}
          <a href="https://pagesnap.com" className="hover:text-white">
            PageSnap
          </a>
        </p>
      </footer>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-dark-950/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1
              );
            }}
            className="absolute left-4 p-3 rounded-full bg-dark-800 hover:bg-dark-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedPhoto].url}
              alt={photos[selectedPhoto].caption || ""}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(
                selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0
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
