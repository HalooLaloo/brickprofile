import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// POST - Submit a lead (public, no auth required)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { siteId, name, email, phone, service, message, source = "contact_form" } = body;

    if (!siteId || !name) {
      return NextResponse.json(
        { error: "Site ID and name are required" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Get site and owner info
    const { data: site, error: siteError } = await supabase
      .from("ps_sites")
      .select(`
        id,
        company_name,
        user_id,
        ps_profiles!inner (
          email,
          plan
        )
      `)
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Combine service with message if provided
    const fullMessage = service
      ? `Service interested in: ${service}\n\n${message || ""}`.trim()
      : message;

    // Save the lead
    const { data: lead, error: leadError } = await supabase
      .from("ps_leads")
      .insert({
        site_id: siteId,
        name,
        email,
        phone,
        message: fullMessage,
        source,
      })
      .select()
      .single();

    if (leadError) {
      console.error("Error saving lead:", leadError);
      return NextResponse.json(
        { error: "Failed to save contact" },
        { status: 500 }
      );
    }

    // Send email notification if Pro user
    const profile = (site as any).ps_profiles;
    if (resend && profile?.plan === "pro" && profile?.email) {
      try {
        await resend.emails.send({
          from: "BrickProfile <notifications@brickprofile.com>",
          to: profile.email,
          subject: `New contact from ${name}${service ? ` - ${service}` : ""} - ${site.company_name}`,
          html: `
            <h2>New Contact Request</h2>
            <p>Someone contacted you through your BrickProfile portfolio!</p>
            <hr>
            <p><strong>Name:</strong> ${name}</p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            ${service ? `<p><strong>Service Interested In:</strong> ${service}</p>` : ""}
            ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
            <hr>
            <p><a href="https://brickprofile.com/leads">View all leads in dashboard</a></p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get leads for logged in user's active site
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get active site from cookie
    const cookieStore = await cookies();
    const activeSiteId = cookieStore.get("active_site_id")?.value;

    // Get user's site(s)
    let site;
    if (activeSiteId) {
      const { data } = await supabase
        .from("ps_sites")
        .select("id")
        .eq("id", activeSiteId)
        .eq("user_id", user.id)
        .single();
      site = data;
    }

    // If no active site or not found, get first site
    if (!site) {
      const { data } = await supabase
        .from("ps_sites")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();
      site = data;
    }

    if (!site) {
      return NextResponse.json({ leads: [] });
    }

    // Get leads
    const { data: leads, error } = await supabase
      .from("ps_leads")
      .select("*")
      .eq("site_id", site.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Mark lead as read
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId, isRead } = await request.json();

    // Verify ownership through site
    const { data: lead, error } = await supabase
      .from("ps_leads")
      .update({ is_read: isRead })
      .eq("id", leadId)
      .select(`
        *,
        ps_sites!inner (user_id)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
