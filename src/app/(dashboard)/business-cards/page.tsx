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
  RefreshCw,
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
}

type Template = "classic" | "modern" | "bold";

const templates: { id: Template; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Clean and professional" },
  { id: "modern", name: "Modern", description: "Sleek with accent color" },
  { id: "bold", name: "Bold", description: "Eye-catching design" },
];

export default function BusinessCardsPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState<Template>("classic");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

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
            // Generate QR code for the portfolio URL
            const portfolioUrl = `https://brickprofile.com/site/${sites[0].slug}`;
            const qr = await QRCode.toDataURL(portfolioUrl, {
              width: 200,
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

  const downloadPDF = async () => {
    if (!cardRef.current) return;

    setGenerating(true);
    try {
      // Standard business card size: 3.5 x 2 inches at 300 DPI = 1050 x 600 pixels
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        backgroundColor: null,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Business card dimensions in mm (85 x 55 mm is standard)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85, 55],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 85, 55);
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

  // Pro gate
  if (isPro === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-brand-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Pro Feature</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Business Card Generator</h1>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Create professional business cards with your portfolio QR code.
            Download print-ready PDF and order from any print shop.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-sm mx-auto">
            {[
              "Professional templates",
              "Auto QR code to portfolio",
              "Print-ready PDF export",
              "Your branding & colors",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-dark-300">{feature}</span>
              </div>
            ))}
          </div>

          <Link href="/upgrade" className="btn-primary btn-lg">
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Pro - $19.99/mo
          </Link>
        </div>
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

  const primaryColor = siteData.primary_color || "#3b82f6";
  const servicesText = siteData.services?.slice(0, 3).map(s => s.name).join(" • ") || "";
  const areasText = Array.isArray(siteData.service_areas)
    ? siteData.service_areas.slice(0, 2).join(" & ")
    : siteData.service_areas || "";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Business Card Generator</h1>
        <p className="text-dark-400">
          Create professional business cards with your portfolio QR code.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Template Selection */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-400" />
              Choose Template
            </h2>
            <div className="grid gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    template === t.id
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-dark-700 hover:border-dark-600"
                  )}
                >
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-dark-400">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Card Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Company:</span>
                <span className="font-medium">{siteData.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Phone:</span>
                <span>{siteData.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Email:</span>
                <span>{siteData.email || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">QR links to:</span>
                <span className="text-brand-400">brickprofile.com/site/{siteData.slug}</span>
              </div>
            </div>
            <p className="text-xs text-dark-500 mt-4">
              Edit these details in the <Link href="/editor" className="text-brand-400 hover:underline">Website Editor</Link>
            </p>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>

            {/* Business Card Preview */}
            <div className="bg-dark-900 rounded-lg p-4 flex items-center justify-center">
              <div
                ref={cardRef}
                className="bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden"
                style={{ width: "340px", height: "200px" }}
              >
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
                            <Phone className="w-3 h-3" /> {siteData.phone}
                          </p>
                        )}
                        {siteData.email && (
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {siteData.email}
                          </p>
                        )}
                        {areasText && (
                          <p className="text-xs text-gray-500">{areasText}</p>
                        )}
                      </div>
                      {qrCodeUrl && (
                        <div className="flex flex-col items-center">
                          <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />
                          <p className="text-[8px] text-gray-400 mt-1">Scan for portfolio</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {template === "modern" && (
                  <div className="h-full flex">
                    <div
                      className="w-2"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: primaryColor }}>
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
                        {qrCodeUrl && (
                          <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {template === "bold" && (
                  <div className="h-full flex flex-col">
                    <div
                      className="py-3 px-5"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <h3 className="text-lg font-bold text-white">{siteData.company_name}</h3>
                    </div>
                    <div className="flex-1 p-5 flex justify-between items-end">
                      <div className="space-y-1">
                        {servicesText && (
                          <p className="text-xs text-gray-600 mb-2">{servicesText}</p>
                        )}
                        {siteData.phone && (
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <Phone className="w-3 h-3" style={{ color: primaryColor }} />
                            {siteData.phone}
                          </p>
                        )}
                        {siteData.email && (
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <Mail className="w-3 h-3" style={{ color: primaryColor }} />
                            {siteData.email}
                          </p>
                        )}
                        {areasText && (
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> {areasText}
                          </p>
                        )}
                      </div>
                      {qrCodeUrl && (
                        <div className="flex flex-col items-center">
                          <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />
                          <p className="text-[8px] text-gray-400 mt-1">View portfolio</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                Download Print-Ready PDF
              </>
            )}
          </button>

          <div className="card p-4 bg-dark-800/50">
            <h3 className="font-medium mb-2">How to print:</h3>
            <ol className="text-sm text-dark-400 space-y-1 list-decimal list-inside">
              <li>Download the PDF file</li>
              <li>Go to any print shop (Officeworks, VistaPrint, etc.)</li>
              <li>Ask for business cards, 85×55mm, double sided if needed</li>
              <li>Upload your PDF and order!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
