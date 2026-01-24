import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import { PLAN_LIMITS } from "@/lib/types";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user has a profile (create if not exists)
    const { data: existingProfile } = await supabase
      .from("ps_profiles")
      .select("id, plan")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from("ps_profiles")
        .insert({
          id: user.id,
          email: user.email!,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return NextResponse.json(
          { error: `Failed to create profile: ${profileError.message}` },
          { status: 500 }
        );
      }
    }

    // Check site limit
    const plan = existingProfile?.plan || "free";
    const maxSites = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].maxSites;

    const { count: siteCount } = await supabase
      .from("ps_sites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((siteCount || 0) >= maxSites) {
      return NextResponse.json(
        { error: `You've reached the maximum number of sites (${maxSites}) for your ${plan} plan.` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      services,
      areas,
      phone,
      email,
      generatedContent,
      photos,
      template,
      primaryColor,
      logo_url,
    } = body;

    // Convert areas to array if it's a string (e.g., "Sydney, 30km radius")
    const serviceAreas = Array.isArray(areas) ? areas : areas ? [areas] : [];

    // Generate a unique slug
    let slug = generateSlug(companyName);

    // Check if slug exists
    const { data: existingSlugs } = await supabase
      .from("ps_sites")
      .select("slug")
      .eq("slug", slug);

    // Only add random suffix if slug already exists
    if (existingSlugs && existingSlugs.length > 0) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Create the site
    const { data: site, error: siteError } = await supabase
      .from("ps_sites")
      .insert({
        user_id: user.id,
        slug,
        company_name: companyName,
        headline: generatedContent?.headline,
        about_text: generatedContent?.aboutText,
        services: services.map((name: string) => ({
          name,
          description: generatedContent?.serviceDescriptions?.[name] || "",
        })),
        service_areas: serviceAreas,
        phone,
        email,
        template: template || "classic",
        primary_color: primaryColor || "#3b82f6",
        logo_url: logo_url || null,
        is_published: true,
      })
      .select()
      .single();

    if (siteError) {
      console.error("Error creating site:", siteError);
      return NextResponse.json(
        { error: `Failed to create site: ${siteError.message}` },
        { status: 500 }
      );
    }

    // Insert photos
    if (photos && photos.length > 0) {
      const photoRecords = photos.map(
        (photo: { url: string; category?: string; caption?: string }, index: number) => ({
          site_id: site.id,
          user_id: user.id,
          url: photo.url,
          category: photo.category || "general",
          caption: photo.caption || "",
          sort_order: index,
        })
      );

      const { error: photosError } = await supabase
        .from("ps_photos")
        .insert(photoRecords);

      if (photosError) {
        console.error("Error inserting photos:", photosError);
      }
    }

    // Update profile with company info
    await supabase
      .from("ps_profiles")
      .update({
        company_name: companyName,
        phone,
      })
      .eq("id", user.id);

    // Send welcome email
    if (resend && user.email) {
      try {
        const siteUrl = `https://${site.slug}.brickprofile.com`;
        await resend.emails.send({
          from: "BrickProfile <contact@brickprofile.com>",
          to: user.email,
          subject: `🎉 Your portfolio is live! - ${companyName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0b; color: #ffffff; padding: 40px 20px; margin: 0;">
              <div style="max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">🧱 BrickProfile</h1>
                </div>

                <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
                  <h2 style="margin: 0 0 16px 0; font-size: 24px;">Welcome, ${companyName}!</h2>
                  <p style="color: #a1a1aa; line-height: 1.6; margin: 0 0 24px 0;">
                    Your professional portfolio is now live and ready to impress potential clients.
                  </p>

                  <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 14px;">Your portfolio URL:</p>
                    <a href="${siteUrl}" style="color: #3b82f6; font-size: 18px; font-weight: 600; text-decoration: none;">${siteUrl}</a>
                  </div>

                  <p style="color: #a1a1aa; line-height: 1.6; margin: 0 0 24px 0;">
                    <strong style="color: #ffffff;">What's next?</strong><br>
                    • Share your link with potential clients<br>
                    • Add more photos to showcase your work<br>
                    • Collect reviews from happy customers
                  </p>

                  <a href="https://brickprofile.com/editor" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Edit Your Portfolio
                  </a>
                </div>

                <p style="text-align: center; color: #52525b; font-size: 14px; margin-top: 32px;">
                  Questions? Reply to this email - we're here to help!
                </p>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const siteId = url.searchParams.get("siteId");

    // If siteId is provided, return single site
    if (siteId) {
      const { data: site, error } = await supabase
        .from("ps_sites")
        .select("*")
        .eq("id", siteId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching site:", error);
        return NextResponse.json(
          { error: "Failed to fetch site" },
          { status: 500 }
        );
      }

      return NextResponse.json({ site });
    }

    // Return all user's sites
    const { data: sites, error } = await supabase
      .from("ps_sites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching sites:", error);
      return NextResponse.json(
        { error: "Failed to fetch sites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { site_id, ...rawUpdateData } = body;

    if (!site_id) {
      return NextResponse.json(
        { error: "site_id is required" },
        { status: 400 }
      );
    }

    // Convert empty strings to null for optional fields
    const nullableFields = [
      "headline", "about_text", "phone", "email", "address",
      "facebook_url", "instagram_url", "google_reviews_url",
      "logo_url", "custom_domain", "quotesnap_user_id"
    ];

    const updateData = { ...rawUpdateData };
    for (const field of nullableFields) {
      if (field in updateData && updateData[field] === "") {
        updateData[field] = null;
      }
    }

    // If slug is being updated, check if it's unique
    if (updateData.slug) {
      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(updateData.slug)) {
        return NextResponse.json(
          { error: "Slug can only contain lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      // Check if slug is already taken by another site
      const { data: existingSlug } = await supabase
        .from("ps_sites")
        .select("id")
        .eq("slug", updateData.slug)
        .neq("id", site_id)
        .single();

      if (existingSlug) {
        return NextResponse.json(
          { error: "This URL is already taken. Please choose a different one." },
          { status: 400 }
        );
      }
    }

    // Handle custom domain changes - add/remove from Vercel
    if ("custom_domain" in updateData) {
      // Get current site to check old domain
      const { data: currentSite } = await supabase
        .from("ps_sites")
        .select("custom_domain")
        .eq("id", site_id)
        .eq("user_id", user.id)
        .single();

      const oldDomain = currentSite?.custom_domain;
      const newDomain = updateData.custom_domain;

      // Remove old domain from Vercel if it exists and is different
      if (oldDomain && oldDomain !== newDomain) {
        await removeDomainFromVercel(oldDomain);
      }

      // Add new domain to Vercel if provided
      if (newDomain && newDomain !== oldDomain) {
        const result = await addDomainToVercel(newDomain);
        if (!result.success) {
          console.error("Failed to add domain to Vercel:", result.error);
          // Don't fail the request, just log it - domain can be added manually
        }
      }
    }

    const { data: site, error } = await supabase
      .from("ps_sites")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", site_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating site:", error);
      console.error("Update data was:", JSON.stringify(updateData, null, 2));
      return NextResponse.json(
        { error: `Failed to update site: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const siteId = url.searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json(
        { error: "siteId is required" },
        { status: 400 }
      );
    }

    // Check how many sites the user has
    const { count: siteCount } = await supabase
      .from("ps_sites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((siteCount || 0) <= 1) {
      return NextResponse.json(
        { error: "Cannot delete your only site" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("ps_sites")
      .delete()
      .eq("id", siteId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting site:", error);
      return NextResponse.json(
        { error: "Failed to delete site" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
