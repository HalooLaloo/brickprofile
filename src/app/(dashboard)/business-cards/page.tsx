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
  Crown,
  CreditCard,
  Phone,
  Mail,
  Globe,
  Palette,
  Layers,
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
}

type Template = "classic" | "modern" | "bold" | "minimal";
type CardSide = "single" | "double";

const templates: { id: Template; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Clean and professional" },
  { id: "modern", name: "Modern", description: "Sleek with accent stripe" },
  { id: "bold", name: "Bold", description: "Eye-catching header" },
  { id: "minimal", name: "Minimal", description: "Simple and elegant" },
];

const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#a855f7" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Black", value: "#1f2937" },
];

export default function BusinessCardsPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState<Template>("classic");
  const [cardSide, setCardSide] = useState<CardSide>("double");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [customColor, setCustomColor] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showingBack, setShowingBack] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitesRes, profileRes] = await Promise.all([
          fetch("/api/sites"),
          fetch("/api/profile"),
        ]);

        if (sitesRes.ok) {
          const { sites } = await sitesRes.json();
          if (sites && sites.length > 0) {
            setSiteData(sites[0]);
            // Use site's primary color as default
            if (sites[0].primary_color) {
              setSelectedColor(sites[0].primary_color);
            }
            // Generate QR code for the portfolio URL
            const portfolioUrl = `https://brickprofile.com/site/${sites[0].slug}`;
            const qr = await QRCode.toDataURL(portfolioUrl, {
              width: 300,
              margin: 1,
              color: { dark: "#000000", light: "#ffffff" },
            });
            setQrCodeUrl(qr);
          }
        }

        if (profileRes.ok) {
          const { profile } = await profileRes.json();
          setIsPro(profile?.plan === "pro");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeColor = customColor || selectedColor;

  const downloadPDF = async () => {
    if (!frontCardRef.current) return;

    setGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85, 55],
      });

      // Capture front side
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const frontImgData = frontCanvas.toDataURL("image/png");
      pdf.addImage(frontImgData, "PNG", 0, 0, 85, 55);

      // If double-sided, add back side
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

      pdf.save(`${siteData?.company_name || "business-card"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Loading state
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

  const servicesText = siteData.services?.slice(0, 3).map(s => s.name).join(" • ") || "";
  const areasText = Array.isArray(siteData.service_areas)
    ? siteData.service_areas.slice(0, 2).join(" & ")
    : siteData.service_areas || "";
  const tagline = siteData.headline || servicesText || "Quality workmanship guaranteed";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Business Card Generator</h1>
        <p className="text-dark-400">
          Create professional business cards with your portfolio QR code.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Options Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-400" />
              Template
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    template === t.id
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-dark-700 hover:border-dark-600"
                  )}
                >
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-dark-400">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: activeColor }} />
              Accent Color
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setSelectedColor(color.value);
                    setCustomColor("");
                  }}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all relative",
                    selectedColor === color.value && !customColor
                      ? "border-white scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && !customColor && (
                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor || selectedColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={customColor || selectedColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#3b82f6"
                className="input flex-1 text-sm font-mono"
              />
            </div>
          </div>

          {/* Card Type */}
          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              Card Type
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCardSide("single")}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all",
                  cardSide === "single"
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-dark-700 hover:border-dark-600"
                )}
              >
                <p className="font-medium text-sm">Single-sided</p>
                <p className="text-xs text-dark-400">Front only</p>
              </button>
              <button
                onClick={() => setCardSide("double")}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all",
                  cardSide === "double"
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-dark-700 hover:border-dark-600"
                )}
              >
                <p className="font-medium text-sm">Double-sided</p>
                <p className="text-xs text-dark-400">Front + Back</p>
              </button>
            </div>
          </div>

          {/* Card Details */}
          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4">Card Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Company:</span>
                <span className="font-medium truncate ml-2">{siteData.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Phone:</span>
                <span>{siteData.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Email:</span>
                <span className="truncate ml-2">{siteData.email || "Not set"}</span>
              </div>
            </div>
            <p className="text-xs text-dark-500 mt-3">
              <Link href="/editor" className="text-brand-400 hover:underline">Edit in Website Editor</Link>
            </p>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              {cardSide === "double" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowingBack(false)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-lg transition-colors",
                      !showingBack ? "bg-brand-500 text-white" : "bg-dark-700 text-dark-300"
                    )}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setShowingBack(true)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-lg transition-colors",
                      showingBack ? "bg-brand-500 text-white" : "bg-dark-700 text-dark-300"
                    )}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>

            {/* Card Preview */}
            <div className="bg-dark-900 rounded-lg p-6 flex items-center justify-center min-h-[280px]">
              {/* Front Card */}
              <div className={cn(!showingBack ? "block" : "hidden")}>
                <div
                  ref={frontCardRef}
                  className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden"
                  style={{ width: "340px", height: "200px" }}
                >
                  {/* Classic Template */}
                  {template === "classic" && (
                    <div className="h-full p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{siteData.company_name}</h3>
                        {servicesText && (
                          <p className="text-xs text-gray-500 mt-1">{servicesText}</p>
                        )}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          {siteData.phone && (
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                              <Phone className="w-3 h-3" style={{ color: activeColor }} /> {siteData.phone}
                            </p>
                          )}
                          {siteData.email && (
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                              <Mail className="w-3 h-3" style={{ color: activeColor }} /> {siteData.email}
                            </p>
                          )}
                          {areasText && (
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> {areasText}
                            </p>
                          )}
                        </div>
                        {cardSide === "single" && qrCodeUrl && (
                          <div className="flex flex-col items-center">
                            <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14" />
                            <p className="text-[7px] text-gray-400 mt-1">View portfolio</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Modern Template */}
                  {template === "modern" && (
                    <div className="h-full flex">
                      <div className="w-2" style={{ backgroundColor: activeColor }} />
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: activeColor }}>
                            {siteData.company_name}
                          </h3>
                          {servicesText && (
                            <p className="text-xs text-gray-500 mt-1">{servicesText}</p>
                          )}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            {siteData.phone && (
                              <p className="text-sm text-gray-700">{siteData.phone}</p>
                            )}
                            {siteData.email && (
                              <p className="text-sm text-gray-700">{siteData.email}</p>
                            )}
                            {areasText && (
                              <p className="text-xs text-gray-500">{areasText}</p>
                            )}
                          </div>
                          {cardSide === "single" && qrCodeUrl && (
                            <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bold Template */}
                  {template === "bold" && (
                    <div className="h-full flex flex-col">
                      <div className="py-3 px-5" style={{ backgroundColor: activeColor }}>
                        <h3 className="text-lg font-bold text-white">{siteData.company_name}</h3>
                      </div>
                      <div className="flex-1 p-4 flex justify-between items-end">
                        <div className="space-y-1">
                          {servicesText && (
                            <p className="text-xs text-gray-600 mb-2">{servicesText}</p>
                          )}
                          {siteData.phone && (
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                              <Phone className="w-3 h-3" style={{ color: activeColor }} />
                              {siteData.phone}
                            </p>
                          )}
                          {siteData.email && (
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                              <Mail className="w-3 h-3" style={{ color: activeColor }} />
                              {siteData.email}
                            </p>
                          )}
                          {areasText && (
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> {areasText}
                            </p>
                          )}
                        </div>
                        {cardSide === "single" && qrCodeUrl && (
                          <div className="flex flex-col items-center">
                            <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14" />
                            <p className="text-[7px] text-gray-400 mt-1">View portfolio</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Minimal Template */}
                  {template === "minimal" && (
                    <div className="h-full p-6 flex flex-col justify-center">
                      <h3 className="text-xl font-light text-gray-900 mb-1">{siteData.company_name}</h3>
                      <div className="w-12 h-0.5 mb-4" style={{ backgroundColor: activeColor }} />
                      <div className="space-y-1 text-sm text-gray-600">
                        {siteData.phone && <p>{siteData.phone}</p>}
                        {siteData.email && <p>{siteData.email}</p>}
                        {areasText && <p className="text-xs text-gray-400 mt-2">{areasText}</p>}
                      </div>
                      {cardSide === "single" && qrCodeUrl && (
                        <div className="absolute bottom-4 right-4">
                          <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Back Card */}
              {cardSide === "double" && (
                <div className={cn(showingBack ? "block" : "hidden")}>
                  <div
                    ref={backCardRef}
                    className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center"
                    style={{ width: "340px", height: "200px" }}
                  >
                    <div className="text-center p-6">
                      {qrCodeUrl && (
                        <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 mx-auto mb-3" />
                      )}
                      <p className="text-sm font-medium" style={{ color: activeColor }}>
                        Scan to view our work
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        brickprofile.com/site/{siteData.slug}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-3 max-w-[200px] mx-auto italic">
                        "{tagline}"
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

          {/* Download Button */}
          <button
            onClick={downloadPDF}
            disabled={generating}
            className="btn-primary btn-lg w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Print-Ready PDF {cardSide === "double" && "(2 pages)"}
              </>
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
