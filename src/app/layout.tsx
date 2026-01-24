import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://brickprofile.com"),
  title: {
    default: "BrickProfile - Portfolio Websites for Contractors",
    template: "%s | BrickProfile",
  },
  description:
    "Create stunning portfolio websites for your contracting business with AI assistance. Showcase your work, collect leads, and grow your business.",
  keywords: [
    "contractor portfolio",
    "construction website",
    "contractor website builder",
    "portfolio builder",
    "AI website generator",
    "tradesman website",
    "builder portfolio",
    "renovation portfolio",
  ],
  authors: [{ name: "BrickProfile" }],
  creator: "BrickProfile",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brickprofile.com",
    siteName: "BrickProfile",
    title: "BrickProfile - Portfolio Websites for Contractors",
    description:
      "Create stunning portfolio websites for your contracting business with AI assistance. Showcase your work, collect leads, and grow your business.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrickProfile - Professional portfolios for contractors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrickProfile - Portfolio Websites for Contractors",
    description:
      "Create stunning portfolio websites for your contracting business with AI assistance.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
