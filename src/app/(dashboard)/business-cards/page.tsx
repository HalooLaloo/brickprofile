"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download,
  Loader2,
  Check,
  Phone,
  Mail,
  Palette,
  Layers,
  Upload,
  X,
  Type,
  Image as ImageIcon,
  Globe,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteData {
  slug: string;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  services: { name: string }[];
  service_areas: string[];
  primary_color: string;
  headline: string;
  logo_url: string | null;
}

type Template = "executive" | "corporate" | "elegant" | "standard";
type CardSide = "single" | "double";

const templates: { id: Template; name: string; description: string }[] = [
  { id: "executive", name: "Executive", description: "Two-column with accent sidebar" },
  { id: "corporate", name: "Corporate", description: "Clean bottom border accent" },
  { id: "elegant", name: "Elegant", description: "Centered with top line" },
  { id: "standard", name: "Standard", description: "Classic horizontal layout" },
];

const accentColorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#a855f7" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Gold", value: "#d97706" },
];

const bgColorPresets = [
  { name: "White", value: "#ffffff", textColor: "#111827" },
  { name: "Cream", value: "#fef9f3", textColor: "#111827" },
  { name: "Light Gray", value: "#f3f4f6", textColor: "#111827" },
  { name: "Charcoal", value: "#374151", textColor: "#ffffff" },
  { name: "Navy", value: "#1e3a5f", textColor: "#ffffff" },
  { name: "Black", value: "#111827", textColor: "#ffffff" },
];

export default function BusinessCardsPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState<Template>("executive");
  const [cardSide, setCardSide] = useState<CardSide>("double");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [customAccentColor, setCustomAccentColor] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [customBgColor, setCustomBgColor] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showingBack, setShowingBack] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  // Editable fields
  const [companyName, setCompanyName] = useState("");
  const [yourName, setYourName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [companyNameColor, setCompanyNameColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitesRes] = await Promise.all([fetch("/api/sites")]);

        if (sitesRes.ok) {
          const { sites } = await sitesRes.json();
          if (sites && sites.length > 0) {
            const site = sites[0];
            setSiteData(site);

            setCompanyName(site.company_name || "");
            setPhone(site.phone || "");
            setEmail(site.email || "");
            setLogoUrl(site.logo_url || null);
            setWebsite(`brickprofile.com/site/${site.slug}`);

            // Services from site data
            const servicesText = site.services?.slice(0, 3).map((s: any) => s.name).join(" • ") || "";
            setServices(servicesText || "Renovations • Bathrooms • Kitchens");

            if (site.service_areas?.length > 0) {
              setAddress(site.service_areas.slice(0, 2).join(", "));
            }

            if (site.primary_color) {
              setAccentColor(site.primary_color);
            }

            const portfolioUrl = `https://brickprofile.com/site/${site.slug}`;
            const qr = await QRCode.toDataURL(portfolioUrl, {
              width: 300,
              margin: 1,
              color: { dark: "#000000", light: "#ffffff" },
            });
            setQrCodeUrl(qr);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeAccentColor = customAccentColor || accentColor;
  const activeBgColor = customBgColor || bgColor;
  const activeTextColor = bgColorPresets.find(c => c.value === activeBgColor)?.textColor ||
    (isLightColor(activeBgColor) ? "#111827" : "#ffffff");
  const secondaryTextColor = isLightColor(activeBgColor) ? "#6b7280" : "#9ca3af";

  function isLightColor(color: string): boolean {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setLogoUrl(url);
      } else {
        alert("Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const downloadPDF = async () => {
    if (!frontCardRef.current) return;

    setGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85, 55],
      });

      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const frontImgData = frontCanvas.toDataURL("image/png");
      pdf.addImage(frontImgData, "PNG", 0, 0, 85, 55);

      if (cardSide === "double" && backCardRef.current) {
        pdf.addPage([85, 55], "landscape");
        const backCanvas = await html2canvas(backCardRef.current, {
          scale: 3,
          backgroundColor: null,
          useCORS: true,
        });
        const backImgData = backCanvas.toDataURL("image/png");
        pdf.addImage(backImgData, "PNG", 0, 0, 85, 55);
      }

      pdf.save(`${companyName || "business-card"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <p className="text-dark-400">No site found. Please create a portfolio first.</p>
          <Link href="/onboarding" className="btn-primary btn-md mt-4">
            Create Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Business Card Generator</h1>
        <p className="text-dark-400">Create professional business cards with your portfolio QR code.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Options Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Template */}
          <div className="card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-400" />
              Template
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "p-2 rounded-lg border-2 text-left transition-all",
                    template === t.id ? "border-brand-500 bg-brand-500/10" : "border-dark-700 hover:border-dark-600"
                  )}
                >
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-dark-400">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeAccentColor }} />
              Accent Color
            </h2>
            <div className="grid grid-cols-8 gap-1.5 mb-3">
              {accentColorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => { setAccentColor(color.value); setCustomAccentColor(""); }}
                  className={cn(
                    "w-full aspect-square rounded border-2 transition-all relative",
                    accentColor === color.value && !customAccentColor ? "border-white scale-110" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {accentColor === color.value && !customAccentColor && (
                    <Check className={cn("w-3 h-3 absolute inset-0 m-auto", color.value === "#ffffff" ? "text-gray-800" : "text-white")} />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="color" value={customAccentColor || accentColor}
                onChange={(e) => setCustomAccentColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent" />
              <input type="text" value={customAccentColor || accentColor}
                onChange={(e) => setCustomAccentColor(e.target.value)}
                placeholder="#3b82f6" className="input flex-1 text-xs font-mono py-1" />
            </div>
          </div>

          {/* Background */}
          <div className="card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-dark-600" style={{ backgroundColor: activeBgColor }} />
              Background
            </h2>
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {bgColorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => { setBgColor(color.value); setCustomBgColor(""); }}
                  className={cn(
                    "w-full aspect-square rounded border-2 transition-all relative",
                    bgColor === color.value && !customBgColor ? "border-brand-500 scale-110" : "border-dark-600 hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {bgColor === color.value && !customBgColor && (
                    <Check className={cn("w-3 h-3 absolute inset-0 m-auto", isLightColor(color.value) ? "text-gray-800" : "text-white")} />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="color" value={customBgColor || bgColor}
                onChange={(e) => setCustomBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent" />
              <input type="text" value={customBgColor || bgColor}
                onChange={(e) => setCustomBgColor(e.target.value)}
                placeholder="#ffffff" className="input flex-1 text-xs font-mono py-1" />
            </div>
          </div>

          {/* Card Type */}
          <div className="card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Card Type
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCardSide("single")}
                className={cn("p-2 rounded-lg border-2 transition-all",
                  cardSide === "single" ? "border-brand-500 bg-brand-500/10" : "border-dark-700 hover:border-dark-600")}>
                <p className="font-medium text-sm">Single-sided</p>
              </button>
              <button onClick={() => setCardSide("double")}
                className={cn("p-2 rounded-lg border-2 transition-all",
                  cardSide === "double" ? "border-brand-500 bg-brand-500/10" : "border-dark-700 hover:border-dark-600")}>
                <p className="font-medium text-sm">Double-sided</p>
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-400" />
              Logo
            </h2>
            {logoUrl ? (
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded bg-white p-1" />
                <button onClick={() => setLogoUrl(null)} className="btn-ghost btn-sm text-red-400 hover:text-red-300">
                  <X className="w-4 h-4 mr-1" /> Remove
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-dark-600 rounded-lg cursor-pointer hover:border-dark-500 transition-colors">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-dark-400" />}
                <span className="text-sm text-dark-400">Upload logo</span>
              </label>
            )}
          </div>

          {/* Card Details */}
          <div className="card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-brand-400" />
              Card Details
            </h2>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-dark-400 mb-1 block">Company Name</label>
                <div className="flex gap-2">
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="input flex-1 text-sm" placeholder="Your Company Name" />
                  <input type="color" value={companyNameColor || activeTextColor}
                    onChange={(e) => setCompanyNameColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border border-dark-600"
                    title="Company name color" />
                </div>
              </div>
              <div>
                <label className="text-xs text-dark-400 mb-1 block">Services</label>
                <input type="text" value={services} onChange={(e) => setServices(e.target.value)}
                  className="input w-full text-sm" placeholder="Renovations • Bathrooms • Kitchens" />
              </div>
              <div>
                <label className="text-xs text-dark-400 mb-1 block">Your Name (optional)</label>
                <input type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}
                  className="input w-full text-sm" placeholder="John Smith" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="input w-full text-sm" placeholder="0400 000 000" />
                </div>
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input w-full text-sm" placeholder="hello@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Website</label>
                  <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                    className="input w-full text-sm" placeholder="yoursite.com" />
                </div>
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Location</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    className="input w-full text-sm" placeholder="Sydney, NSW" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Preview</h2>
              {cardSide === "double" && (
                <div className="flex gap-1">
                  <button onClick={() => setShowingBack(false)}
                    className={cn("px-3 py-1 text-sm rounded-lg transition-colors",
                      !showingBack ? "bg-brand-500 text-white" : "bg-dark-700 text-dark-300")}>
                    Front
                  </button>
                  <button onClick={() => setShowingBack(true)}
                    className={cn("px-3 py-1 text-sm rounded-lg transition-colors",
                      showingBack ? "bg-brand-500 text-white" : "bg-dark-700 text-dark-300")}>
                    Back
                  </button>
                </div>
              )}
            </div>

            <div className="bg-dark-900 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
              {/* Front Card */}
              <div className={cn(!showingBack ? "block" : "hidden")}>
                <div
                  ref={frontCardRef}
                  className="rounded-lg shadow-2xl overflow-hidden"
                  style={{ width: "360px", height: "210px", backgroundColor: activeBgColor, color: activeTextColor }}
                >
                  {/* EXECUTIVE - Two column with sidebar */}
                  {template === "executive" && (
                    <div className="h-full flex">
                      <div className="w-[100px] p-4 flex flex-col justify-between" style={{ backgroundColor: activeAccentColor }}>
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain bg-white/20 rounded p-1" />
                        ) : <div className="w-16 h-16" />}
                        {cardSide === "single" && qrCodeUrl && (
                          <img src={qrCodeUrl} alt="QR" className="w-14 h-14 rounded" />
                        )}
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <p className="text-lg font-bold leading-tight" style={{ color: companyNameColor || activeTextColor }}>{companyName || "Company Name"}</p>
                          {services && <p className="text-[10px] mt-1 font-medium" style={{ color: activeAccentColor }}>{services}</p>}
                        </div>
                        <div>
                          {yourName && <p className="font-semibold text-sm mb-2">{yourName}</p>}
                          <div className="space-y-1 text-xs" style={{ color: secondaryTextColor }}>
                            {phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" style={{ color: activeAccentColor }} />{phone}</p>}
                            {email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" style={{ color: activeAccentColor }} />{email}</p>}
                            {website && <p className="flex items-center gap-2"><Globe className="w-3 h-3" style={{ color: activeAccentColor }} />{website}</p>}
                            {address && <p className="flex items-center gap-2"><MapPin className="w-3 h-3" style={{ color: activeAccentColor }} />{address}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CORPORATE - Header bar with company name */}
                  {template === "corporate" && (
                    <div className="h-full flex flex-col">
                      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: activeAccentColor }}>
                        <p className="text-base font-bold" style={{ color: companyNameColor || "#ffffff" }}>{companyName || "Company Name"}</p>
                        {logoUrl && <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />}
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        {services && (
                          <p className="text-[10px] font-medium" style={{ color: activeAccentColor }}>{services}</p>
                        )}
                        <div className="flex justify-between items-end">
                          <div>
                            {yourName && <p className="font-semibold text-sm mb-2">{yourName}</p>}
                            <div className="space-y-1 text-xs" style={{ color: secondaryTextColor }}>
                              {phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: activeAccentColor }} />{phone}</p>}
                              {email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: activeAccentColor }} />{email}</p>}
                              {website && <p className="flex items-center gap-1.5"><Globe className="w-3 h-3" style={{ color: activeAccentColor }} />{website}</p>}
                              {address && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" style={{ color: activeAccentColor }} />{address}</p>}
                            </div>
                          </div>
                          {cardSide === "single" && qrCodeUrl && (
                            <img src={qrCodeUrl} alt="QR" className="w-14 h-14" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ELEGANT - Centered with top accent */}
                  {template === "elegant" && (
                    <div className="h-full flex flex-col">
                      <div className="h-1.5" style={{ backgroundColor: activeAccentColor }} />
                      <div className="flex-1 p-5 flex flex-col items-center justify-center text-center">
                        {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain mb-2" />}
                        <p className="text-lg font-bold" style={{ color: companyNameColor || activeTextColor }}>{companyName || "Company Name"}</p>
                        {services && <p className="text-[10px] mt-1 mb-2" style={{ color: activeAccentColor }}>{services}</p>}
                        {yourName && <p className="text-sm font-medium mb-3">{yourName}</p>}
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: secondaryTextColor }}>
                          {phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: activeAccentColor }} />{phone}</p>}
                          {email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: activeAccentColor }} />{email}</p>}
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-1" style={{ color: secondaryTextColor }}>
                          {website && <p className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: activeAccentColor }} />{website}</p>}
                          {address && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: activeAccentColor }} />{address}</p>}
                        </div>
                        {cardSide === "single" && qrCodeUrl && (
                          <img src={qrCodeUrl} alt="QR" className="w-12 h-12 mt-2" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* STANDARD - Classic horizontal */}
                  {template === "standard" && (
                    <div className="h-full p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
                          <div>
                            <p className="text-lg font-bold leading-tight" style={{ color: companyNameColor || activeTextColor }}>{companyName || "Company Name"}</p>
                            {services && <p className="text-[10px] mt-0.5" style={{ color: activeAccentColor }}>{services}</p>}
                          </div>
                        </div>
                        {cardSide === "single" && qrCodeUrl && (
                          <img src={qrCodeUrl} alt="QR" className="w-12 h-12" />
                        )}
                      </div>
                      <div>
                        {yourName && <p className="font-medium text-sm mb-2">{yourName}</p>}
                        <div className="flex justify-between">
                          <div className="space-y-1 text-xs" style={{ color: secondaryTextColor }}>
                            {phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: activeAccentColor }} />{phone}</p>}
                            {email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: activeAccentColor }} />{email}</p>}
                          </div>
                          <div className="space-y-1 text-xs text-right" style={{ color: secondaryTextColor }}>
                            {website && <p className="flex items-center justify-end gap-1.5"><Globe className="w-3 h-3" style={{ color: activeAccentColor }} />{website}</p>}
                            {address && <p className="flex items-center justify-end gap-1.5"><MapPin className="w-3 h-3" style={{ color: activeAccentColor }} />{address}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-0.5 mt-2" style={{ backgroundColor: activeAccentColor }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Back Card */}
              {cardSide === "double" && (
                <div className={cn(showingBack ? "block" : "hidden")}>
                  <div
                    ref={backCardRef}
                    className="rounded-lg shadow-2xl overflow-hidden"
                    style={{ width: "360px", height: "210px", backgroundColor: activeBgColor, color: activeTextColor }}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      {logoUrl && <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-3" />}
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 mb-3" />}
                      <p className="text-sm font-medium" style={{ color: activeAccentColor }}>
                        Scan to view our work
                      </p>
                      <p className="text-xs mt-1" style={{ color: secondaryTextColor }}>
                        {website || `brickprofile.com/site/${siteData.slug}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-dark-500 text-center mt-3">
              Standard size: 85 × 55 mm (3.5 × 2 inches)
            </p>
          </div>

          <button onClick={downloadPDF} disabled={generating} className="btn-primary btn-lg w-full">
            {generating ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating PDF...</>
            ) : (
              <><Download className="w-5 h-5 mr-2" /> Download Print-Ready PDF {cardSide === "double" && "(2 pages)"}</>
            )}
          </button>

          <div className="card p-4 bg-dark-800/50">
            <h3 className="font-medium mb-2">How to print:</h3>
            <ol className="text-sm text-dark-400 space-y-1 list-decimal list-inside">
              <li>Download the PDF file</li>
              <li>Go to any print shop (Officeworks, VistaPrint, Moo, etc.)</li>
              <li>Order business cards 85×55mm, {cardSide === "double" ? "double-sided" : "single-sided"}</li>
              <li>Upload your PDF and order!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
