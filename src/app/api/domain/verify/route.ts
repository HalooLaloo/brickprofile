import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import dns from "dns";
import { promisify } from "util";

const resolveCname = promisify(dns.resolveCname);

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const domain = url.searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Check if user owns a site with this domain
    const { data: site } = await supabase
      .from("ps_sites")
      .select("id")
      .eq("user_id", user.id)
      .eq("custom_domain", domain)
      .single();

    if (!site) {
      return NextResponse.json(
        { error: "Domain not found in your account" },
        { status: 404 }
      );
    }

    // Try to resolve CNAME record
    try {
      const hostname = domain.startsWith("www.") ? domain : `www.${domain}`;
      const records = await resolveCname(hostname);

      // Check if any CNAME points to Vercel
      const isVerified = records.some(
        (record) =>
          record.includes("vercel") ||
          record.includes("vercel-dns.com") ||
          record.includes(".vercel.app")
      );

      if (isVerified) {
        return NextResponse.json({
          verified: true,
          message: "Domain is correctly configured!",
          records,
        });
      } else {
        return NextResponse.json({
          verified: false,
          message: `CNAME found but not pointing to Vercel. Found: ${records.join(", ")}`,
          records,
        });
      }
    } catch (dnsError: any) {
      // ENOTFOUND means no DNS record found
      if (dnsError.code === "ENOTFOUND" || dnsError.code === "ENODATA") {
        return NextResponse.json({
          verified: false,
          message: "No CNAME record found. Please add the DNS record and wait for propagation.",
        });
      }

      // For other errors, try alternative check
      console.error("DNS lookup error:", dnsError);
      return NextResponse.json({
        verified: false,
        message: "Could not verify DNS. Please ensure the CNAME record is set correctly.",
      });
    }
  } catch (error) {
    console.error("Error verifying domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
