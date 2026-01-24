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

    // Send email notification
    const profile = (site as any).ps_profiles;
    const isPro = profile?.plan === "pro";

    if (resend && profile?.email) {
      try {
        if (isPro) {
          // Pro users get full details
          await resend.emails.send({
            from: "BrickProfile <notifications@brickprofile.com>",
            to: profile.email,
            subject: `🔔 New lead: ${name}${service ? ` - ${service}` : ""} | ${site.company_name}`,
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
                    <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">🧱 BrickProfile</h1>
                  </div>

                  <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
                    <div style="background-color: #22c55e20; border: 1px solid #22c55e40; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
                      <p style="margin: 0; color: #22c55e; font-weight: 600;">🎉 New Lead from your portfolio!</p>
                    </div>

                    <h2 style="margin: 0 0 20px 0; font-size: 20px;">Contact Details</h2>

                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa; width: 120px;">Name</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; font-weight: 600;">${name}</td>
                      </tr>
                      ${email ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa;">Email</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                      </tr>
                      ` : ""}
                      ${phone ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa;">Phone</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a;"><a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a></td>
                      </tr>
                      ` : ""}
                      ${service ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa;">Service</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #27272a;">${service}</td>
                      </tr>
                      ` : ""}
                    </table>

                    ${message ? `
                    <div style="margin-top: 20px;">
                      <p style="color: #a1a1aa; margin: 0 0 8px 0;">Message:</p>
                      <div style="background-color: #27272a; border-radius: 8px; padding: 16px;">
                        <p style="margin: 0; line-height: 1.6;">${message}</p>
                      </div>
                    </div>
                    ` : ""}

                    <div style="margin-top: 24px;">
                      <a href="https://brickprofile.com/leads" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        View All Leads
                      </a>
                    </div>
                  </div>
                </div>
              </body>
              </html>
            `,
          });
        } else {
          // Free users get limited info with upgrade prompt
          await resend.emails.send({
            from: "BrickProfile <notifications@brickprofile.com>",
            to: profile.email,
            subject: `🔔 New lead from ${name}! | ${site.company_name}`,
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
                    <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">🧱 BrickProfile</h1>
                  </div>

                  <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
                    <div style="background-color: #22c55e20; border: 1px solid #22c55e40; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
                      <p style="margin: 0; color: #22c55e; font-weight: 600;">🎉 You got a new lead!</p>
                    </div>

                    <h2 style="margin: 0 0 16px 0; font-size: 20px;">Someone wants to contact you</h2>

                    <p style="color: #a1a1aa; margin: 0 0 8px 0;">Name:</p>
                    <p style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">${name}</p>

                    ${service ? `
                    <p style="color: #a1a1aa; margin: 0 0 8px 0;">Interested in:</p>
                    <p style="font-size: 16px; margin: 0 0 24px 0;">${service}</p>
                    ` : ""}

                    <div style="background: linear-gradient(135deg, #f59e0b20, #f59e0b10); border: 1px solid #f59e0b40; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; font-weight: 600; color: #f59e0b;">⭐ Upgrade to Pro to see:</p>
                      <ul style="margin: 0; padding-left: 20px; color: #a1a1aa;">
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Full message</li>
                        <li>Instant email notifications</li>
                      </ul>
                    </div>

                    <a href="https://brickprofile.com/upgrade" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 12px;">
                      Upgrade to Pro - $19.99/mo
                    </a>

                    <a href="https://brickprofile.com/leads" style="display: inline-block; background-color: #27272a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                      View in Dashboard
                    </a>
                  </div>
                </div>
              </body>
              </html>
            `,
          });
        }
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
