import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's site
    const { data: site } = await supabase
      .from("ps_sites")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const { data: reviews, error } = await supabase
      .from("ps_reviews")
      .select("*")
      .eq("site_id", site.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { client_name, client_location, rating, text, project_type, site_id } = body;

    if (!site_id) {
      return NextResponse.json({ error: "Site ID is required" }, { status: 400 });
    }

    // Verify the site belongs to the user
    const { data: site } = await supabase
      .from("ps_sites")
      .select("id")
      .eq("id", site_id)
      .eq("user_id", user.id)
      .single();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check plan limits
    const { data: profile } = await supabase
      .from("ps_profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const isPro = profile?.plan === "pro";

    // Count existing reviews
    const { count } = await supabase
      .from("ps_reviews")
      .select("*", { count: "exact", head: true })
      .eq("site_id", site.id);

    if (!isPro && (count || 0) >= 5) {
      return NextResponse.json(
        { error: "Review limit reached. Upgrade to Pro for unlimited reviews." },
        { status: 403 }
      );
    }

    const { data: review, error } = await supabase
      .from("ps_reviews")
      .insert({
        site_id: site.id,
        client_name,
        client_location,
        rating: Math.min(5, Math.max(1, rating)),
        text,
        project_type,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
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
    const { id, ...updates } = body;

    // Validate rating if provided
    if (updates.rating) {
      updates.rating = Math.min(5, Math.max(1, updates.rating));
    }

    // Get user's site to verify ownership
    const { data: site } = await supabase
      .from("ps_sites")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const { data: review, error } = await supabase
      .from("ps_reviews")
      .update(updates)
      .eq("id", id)
      .eq("site_id", site.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      return NextResponse.json(
        { error: "Failed to update review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Get user's site to verify ownership
    const { data: site } = await supabase
      .from("ps_sites")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("ps_reviews")
      .delete()
      .eq("id", id)
      .eq("site_id", site.id);

    if (error) {
      console.error("Error deleting review:", error);
      return NextResponse.json(
        { error: "Failed to delete review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
