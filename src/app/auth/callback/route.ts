import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// App redirect configuration
const APP_REDIRECTS: Record<string, { url: string; defaultPath: string }> = {
  brickquote: { url: "https://brickquote.app", defaultPath: "/requests" },
  bricktask: { url: "https://bricktask.app", defaultPath: "/dashboard" },
  brickprofile: { url: "https://brickprofile.com", defaultPath: "/onboarding" },
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get source app from user metadata
        const sourceApp = user.user_metadata?.source_app as string | undefined;

        // Create profile for brickprofile users
        if (sourceApp === "brickprofile" || !sourceApp) {
          const { data: existingProfile } = await supabase
            .from("ps_profiles")
            .select("id")
            .eq("id", user.id)
            .single();

          if (!existingProfile) {
            await supabase.from("ps_profiles").insert({
              id: user.id,
              email: user.email,
            });
          }
        }

        // Redirect to the source app
        if (sourceApp && APP_REDIRECTS[sourceApp]) {
          const appConfig = APP_REDIRECTS[sourceApp];
          const redirectPath = next || appConfig.defaultPath;
          return NextResponse.redirect(`${appConfig.url}${redirectPath}`);
        }
      }

      // Default: stay on brickprofile
      return NextResponse.redirect(`${origin}${next || "/onboarding"}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
