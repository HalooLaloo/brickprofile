import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;

      if (userId && session.subscription) {
        // Update profile to Pro
        const { data: updatedProfile } = await supabase
          .from("ps_profiles")
          .update({
            plan: "pro",
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
          })
          .eq("id", userId)
          .select("email, company_name")
          .single();

        // Send upgrade confirmation email
        if (resend && updatedProfile?.email) {
          try {
            await resend.emails.send({
              from: "BrickProfile <contact@brickprofile.com>",
              to: updatedProfile.email,
              subject: "🎉 Welcome to BrickProfile Pro!",
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

                    <div style="background: linear-gradient(135deg, #f59e0b20, #f59e0b10); border: 1px solid #f59e0b40; border-radius: 12px; padding: 32px; margin-bottom: 24px; text-align: center;">
                      <p style="font-size: 48px; margin: 0 0 16px 0;">👑</p>
                      <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #f59e0b;">You're now Pro!</h2>
                      <p style="margin: 0; color: #a1a1aa;">Thank you for upgrading${updatedProfile.company_name ? `, ${updatedProfile.company_name}` : ""}!</p>
                    </div>

                    <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
                      <h3 style="margin: 0 0 20px 0; font-size: 18px;">Your Pro features are now unlocked:</h3>

                      <ul style="margin: 0; padding: 0; list-style: none;">
                        <li style="padding: 12px 0; border-bottom: 1px solid #27272a; display: flex; align-items: center;">
                          <span style="color: #22c55e; margin-right: 12px;">✓</span>
                          <span>Unlimited portfolio photos</span>
                        </li>
                        <li style="padding: 12px 0; border-bottom: 1px solid #27272a; display: flex; align-items: center;">
                          <span style="color: #22c55e; margin-right: 12px;">✓</span>
                          <span>Full lead contact details in emails</span>
                        </li>
                        <li style="padding: 12px 0; border-bottom: 1px solid #27272a; display: flex; align-items: center;">
                          <span style="color: #22c55e; margin-right: 12px;">✓</span>
                          <span>Custom domain support</span>
                        </li>
                        <li style="padding: 12px 0; border-bottom: 1px solid #27272a; display: flex; align-items: center;">
                          <span style="color: #22c55e; margin-right: 12px;">✓</span>
                          <span>AI Social Content Generator</span>
                        </li>
                        <li style="padding: 12px 0; border-bottom: 1px solid #27272a; display: flex; align-items: center;">
                          <span style="color: #22c55e; margin-right: 12px;">✓</span>
                          <span>Business Card PDF Download</span>
                        </li>
                        <li style="padding: 12px 0; display: flex; align-items: center;">
                          <span style="color: #22c55e; margin-right: 12px;">✓</span>
                          <span>Full Analytics Dashboard</span>
                        </li>
                      </ul>

                      <div style="margin-top: 24px;">
                        <a href="https://brickprofile.com/editor" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                          Go to Dashboard
                        </a>
                      </div>
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
            console.error("Error sending upgrade email:", emailError);
          }
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      // Find user by customer ID
      const { data: profile } = await supabase
        .from("ps_profiles")
        .select("id")
        .eq("stripe_customer_id", subscription.customer as string)
        .single();

      if (profile) {
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        await supabase
          .from("ps_profiles")
          .update({
            plan: isActive ? "pro" : "free",
            subscription_status: subscription.status,
          })
          .eq("id", profile.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      // Find user by customer ID
      const { data: profile } = await supabase
        .from("ps_profiles")
        .select("id")
        .eq("stripe_customer_id", subscription.customer as string)
        .single();

      if (profile) {
        await supabase
          .from("ps_profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
            stripe_subscription_id: null,
          })
          .eq("id", profile.id);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      // Find user by customer ID
      const { data: profile } = await supabase
        .from("ps_profiles")
        .select("id")
        .eq("stripe_customer_id", invoice.customer as string)
        .single();

      if (profile) {
        await supabase
          .from("ps_profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("id", profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
