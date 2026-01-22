import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { platform, postType, photos, companyInfo } = await request.json();

    if (!platform || !postType) {
      return NextResponse.json(
        { error: "Platform and post type are required" },
        { status: 400 }
      );
    }

    const companyName = companyInfo?.company_name || "Our company";
    const services = companyInfo?.services?.map((s: { name: string }) => s.name).join(", ") || "professional services";
    const areas = Array.isArray(companyInfo?.service_areas)
      ? companyInfo.service_areas.join(", ")
      : companyInfo?.service_areas || "";

    // Build prompt based on post type and platform
    let prompt = "";

    const platformStyle = platform === "instagram"
      ? `
- Use 2-3 relevant emojis at the start
- Keep the main text concise (2-3 short paragraphs)
- End with a call-to-action
- Add 15-20 relevant hashtags at the end (mix of popular and niche)
- Make it visually appealing with line breaks
- Use British English spelling`
      : `
- Can be slightly longer and more conversational
- Use 1-2 emojis sparingly
- Include a clear call-to-action
- Add 3-5 relevant hashtags at the end
- Tell a story or share insight
- Use British English spelling`;

    switch (postType) {
      case "before-after":
        const beforePhoto = photos?.[0];
        const afterPhoto = photos?.[1];
        prompt = `Write an engaging ${platform} post for a contractor showing a before & after transformation.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}
${beforePhoto?.category ? `Project type: ${beforePhoto.category}` : ""}
${beforePhoto?.caption ? `Before context: ${beforePhoto.caption}` : ""}
${afterPhoto?.caption ? `After context: ${afterPhoto.caption}` : ""}

The post should:
- Create excitement about the transformation
- Highlight the quality of work
- Mention the type of work done
- Encourage engagement (likes, comments, shares)
${platformStyle}

Write only the post text, nothing else.`;
        break;

      case "showcase":
        const showcasePhoto = photos?.[0];
        prompt = `Write an engaging ${platform} post showcasing a completed project by a contractor.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}
${showcasePhoto?.category ? `Project type: ${showcasePhoto.category}` : ""}
${showcasePhoto?.caption ? `Project details: ${showcasePhoto.caption}` : ""}
Number of photos: ${photos?.length || 1}

The post should:
- Highlight the craftsmanship and attention to detail
- Mention specific features or challenges overcome
- Show pride in the work
- Include a soft call-to-action for enquiries
${platformStyle}

Write only the post text, nothing else.`;
        break;

      case "offer":
        prompt = `Write an engaging ${platform} post promoting a special offer from a contractor.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}

The post should:
- Create urgency without being pushy
- Mention a realistic seasonal offer (e.g., "Book your spring renovation now")
- Highlight the value customers will receive
- Include a clear call-to-action (call, message, or visit website)
- Feel genuine and not overly salesy
${platformStyle}

Write only the post text, nothing else.`;
        break;

      case "testimonial":
        prompt = `Write an engaging ${platform} post sharing a customer testimonial for a contractor.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}
${photos?.[0]?.caption ? `Project context: ${photos[0].caption}` : ""}

The post should:
- Create a realistic, believable testimonial quote (since we don't have a real one)
- Include the customer's first name only (make one up like "Sarah" or "Mike")
- Mention specific aspects they loved about the service
- Show gratitude to the customer
- Encourage others to share their experiences
${platformStyle}

Write only the post text, nothing else.`;
        break;

      case "quick-tip":
        prompt = `Write a short, engaging ${platform} post with ONE quick tip for homeowners from a ${services} contractor.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}

Format:
- Start with an attention-grabbing hook or emoji
- Share ONE specific, actionable tip related to ${services}
- End with an engaging question to encourage comments
- Keep it SHORT (3-4 sentences max)
${platformStyle}

Example format: "Quick tip 💡 [tip here]. [Why it matters]. What's your experience with this? 👇"

Write only the post text, nothing else.`;
        break;

      case "question":
        prompt = `Write an engaging ${platform} poll/question post to spark discussion among followers.

Company: ${companyName} (${services} contractor)
Services: ${services}
${areas ? `Location: ${areas}` : ""}

The post should:
- Ask ONE thought-provoking question related to home improvement or ${services}
- Make it relatable to homeowners
- Encourage people to share their opinions in comments
- Be conversational and friendly
- Keep it short and punchy
${platformStyle}

Example topics: renovation preferences, common mistakes, style choices, DIY vs professional, timing of projects, budget priorities.

Write only the post text, nothing else.`;
        break;

      case "did-you-know":
        prompt = `Write an interesting "Did You Know?" ${platform} post sharing a surprising fact about ${services}.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}

The post should:
- Start with "Did you know?" or similar hook
- Share ONE genuinely interesting/surprising fact about ${services} or home improvement
- Explain why this matters to homeowners
- Be educational and valuable
- End with a subtle mention that ${companyName} can help
${platformStyle}

Make the fact specific and believable, not generic.

Write only the post text, nothing else.`;
        break;

      case "this-or-that":
        prompt = `Write a fun "This or That" comparison ${platform} post to engage followers.

Company: ${companyName} (${services} contractor)
Services: ${services}

The post should:
- Present TWO options related to home improvement or ${services}
- Make both options appealing (no obvious "right" answer)
- Ask followers to choose and comment why
- Be fun and engaging, not too serious
- Use emojis to represent each option
${platformStyle}

Example: "This or That 🤔 Modern minimalist bathroom ⬜ OR Classic traditional bathroom 🏛️ Which one are you? Drop your answer below! 👇"

Write only the post text, nothing else.`;
        break;

      case "behind-scenes":
        prompt = `Write a casual "behind the scenes" ${platform} post showing the real work process.

Company: ${companyName}
Services: ${services}
${areas ? `Location: ${areas}` : ""}
${photos?.[0]?.category ? `Work type: ${photos[0].category}` : ""}

The post should:
- Feel authentic and unpolished (not corporate)
- Show the human side of the work
- Mention something specific about the process (early start, attention to detail, teamwork, etc.)
- Be relatable and engaging
- Subtly showcase expertise without bragging
${platformStyle}

Write only the post text, nothing else.`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid post type" },
          { status: 400 }
        );
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a social media expert for tradespeople and contractors. You write engaging, authentic posts that drive engagement and enquiries. You avoid corporate jargon and write in a friendly, professional tone.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const post = completion.choices[0]?.message?.content;

    if (!post) {
      throw new Error("No content generated");
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error generating social post:", error);
    return NextResponse.json(
      { error: "Failed to generate post. Please try again." },
      { status: 500 }
    );
  }
}
