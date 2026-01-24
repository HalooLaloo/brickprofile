import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!resend) {
      console.error("Resend not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Send email to support
    await resend.emails.send({
      from: "BrickProfile <contact@brickprofile.com>",
      to: "contact@brickprofile.com",
      replyTo: email,
      subject: `Contact Form: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0b; color: #ffffff; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px;">New Contact Form Submission</h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa; width: 100px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #27272a; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #27272a;">
                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 20px;">
                <p style="color: #a1a1aa; margin: 0 0 8px 0;">Message:</p>
                <div style="background-color: #27272a; border-radius: 8px; padding: 16px;">
                  <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <div style="margin-top: 24px;">
                <a href="mailto:${email}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Reply to ${name}
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
