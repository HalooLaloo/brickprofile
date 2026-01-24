import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import { PLAN_LIMITS } from "@/lib/types";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";

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
    const { data: existingSlug } = await supabase
      .from("ps_sites")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existingSlug) {
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
