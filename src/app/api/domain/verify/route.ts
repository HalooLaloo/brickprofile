import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDomainConfig } from "@/lib/vercel";

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

    // Check domain status via Vercel API
    const config = await getDomainConfig(domain);

    if (config.verified) {
      return NextResponse.json({
        verified: true,
        message: "Domain is correctly configured and verified!",
      });
    } else if (config.configured) {
      return NextResponse.json({
        verified: false,
        message: "Domain is added to Vercel but DNS is not yet configured. Please add the CNAME record.",
      });
    } else {
      return NextResponse.json({
        verified: false,
        message: "Domain is pending configuration. Please add the CNAME record and wait for DNS propagation.",
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
