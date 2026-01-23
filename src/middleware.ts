import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

// Main domains that should NOT be treated as custom domains
const MAIN_DOMAINS = [
  "brickprofile.com",
  "www.brickprofile.com",
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
];

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Check if this is a custom domain request
  const isMainDomain = MAIN_DOMAINS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`) || host.includes("vercel.app")
  );

  // If it's a custom domain and requesting the root path
  if (!isMainDomain && request.nextUrl.pathname === "/") {
    // Look up the site by custom domain
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: site } = await supabase
      .from("ps_sites")
      .select("slug")
      .eq("custom_domain", host)
      .single();

    if (site) {
      // Rewrite to the site page
      const url = request.nextUrl.clone();
      url.pathname = `/site/${site.slug}`;
      return NextResponse.rewrite(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (let them handle their own auth)
     * - site routes (public portfolio pages)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api|site).*)",
  ],
};
