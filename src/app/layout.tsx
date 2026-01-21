import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrickProfile - Portfolio Websites for Contractors",
  description:
    "Create stunning portfolio websites for your contracting business with AI assistance.",
  keywords: [
    "contractor portfolio",
    "construction website",
    "contractor website builder",
    "portfolio builder",
    "AI website generator",
  ],
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
