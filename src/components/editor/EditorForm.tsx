"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Palette,
  Layout,
  Link as LinkIcon,
  Check,
  ExternalLink,
  Crown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Site, Service } from "@/lib/types";

interface EditorFormProps {
  site: Site;
  isPro: boolean;
}

const templates: { id: Site["template"]; name: string }[] = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "bold", name: "Bold" },
  { id: "minimal", name: "Minimal" },
];

export function EditorForm({ site, isPro }: EditorFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    company_name: site.company_name || "",
    headline: site.headline || "",
    about_text: site.about_text || "",
    services: site.services || [],
    service_areas: site.service_areas || [],
    phone: site.phone || "",
    email: site.email || "",
    address: site.address || "",
    facebook_url: site.facebook_url || "",
    instagram_url: site.instagram_url || "",
    google_reviews_url: site.google_reviews_url || "",
    template: site.template || "classic",
    primary_color: site.primary_color || "#3b82f6",
    is_published: site.is_published,
    show_quote_button: site.show_quote_button,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setSaved(false);
  };

  const handleServiceAreasChange = (value: string) => {
    const areas = value.split(",").map((a) => a.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, service_areas: areas }));
    setSaved(false);
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const newServices = [...(formData.services as Service[])];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData((prev) => ({ ...prev, services: newServices }));
    setSaved(false);
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...(prev.services as Service[]), { name: "", description: "" }],
    }));
    setSaved(false);
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev.services as Service[]).filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/sites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, site_id: site.id }),
      });

      if (response.ok) {
        setSaved(true);
        router.refresh();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes. Please try again.");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href={`/site/${site.slug}`}
            target="_blank"
            className="btn-secondary btn-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview Site
          </a>
          <span
            className={cn(
              "badge",
              formData.is_published ? "badge-success" : "badge-warning"
            )}
          >
            {formData.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary btn-md"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Company Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-400" />
          Company Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="input"
              placeholder="Quality work you can trust"
            />
          </div>
          <div>
            <label className="label">About Text</label>
            <textarea
              name="about_text"
              value={formData.about_text}
              onChange={handleChange}
              className="input min-h-[120px]"
              rows={5}
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Services</h2>
        <div className="space-y-4">
          {(formData.services as Service[]).map((service, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  className="input"
                  placeholder="Service name"
                />
                <textarea
                  value={service.description}
                  onChange={(e) =>
                    handleServiceChange(index, "description", e.target.value)
                  }
                  className="input"
                  placeholder="Service description"
                  rows={2}
                />
              </div>
              <button
                onClick={() => removeService(index)}
                className="btn-ghost btn-sm text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={addService} className="btn-secondary btn-sm">
            + Add Service
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-brand-400" />
          Contact Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+44 123 456 7890"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="hello@company.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input"
              placeholder="123 Main St, City"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Service Areas</label>
            <input
              type="text"
              value={(formData.service_areas || []).join(", ")}
              onChange={(e) => handleServiceAreasChange(e.target.value)}
              className="input"
              placeholder="London, Manchester, Birmingham"
            />
            <p className="text-xs text-dark-500 mt-1">
              Separate areas with commas
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-brand-400" />
          Social Links
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Facebook URL</label>
            <input
              type="url"
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleChange}
              className="input"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="label">Instagram URL</label>
            <input
              type="url"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              className="input"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
        </div>
      </div>

      {/* Pro Features */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          Pro Features
          {!isPro && <span className="badge-primary text-xs ml-2">Pro</span>}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label flex items-center gap-2">
              <Star className="w-4 h-4" />
              Google Reviews Link
            </label>
            {isPro ? (
              <>
                <input
                  type="url"
                  name="google_reviews_url"
                  value={formData.google_reviews_url}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://g.page/r/YOUR_BUSINESS/review"
                />
                <p className="text-xs text-dark-500 mt-1">
                  Paste your Google Maps review link to show a &quot;View Google Reviews&quot; button on your site
                </p>
              </>
            ) : (
              <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
                <p className="text-sm text-dark-400 mb-3">
                  Upgrade to Pro to add a Google Reviews link to your portfolio and build trust with potential clients.
                </p>
                <a href="/upgrade" className="btn-primary btn-sm">
                  Upgrade to Pro
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Design */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-brand-400" />
          Design Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Template</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      template: template.id,
                    }))
                  }
                  className={cn(
                    "p-3 rounded-lg border-2 text-center transition-all",
                    formData.template === template.id
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-dark-700 hover:border-dark-600"
                  )}
                >
                  <Layout className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm">{template.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleChange}
                className="input w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Publishing</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="font-medium">Publish Website</p>
              <p className="text-sm text-dark-400">
                Make your portfolio visible at {site.slug}.pagesnap.com
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="show_quote_button"
              checked={formData.show_quote_button}
              onChange={handleChange}
              className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="font-medium">Show &quot;Get Quote&quot; Button</p>
              <p className="text-sm text-dark-400">
                Connect to QuoteSnap for instant quotes
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary btn-lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
