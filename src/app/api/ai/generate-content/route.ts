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

    const { answers } = await request.json();

    const { companyName, services, experience, areas, specialties } = answers;

    const prompt = `You are a professional copywriter for contractor websites. Generate website content for a contractor with the following details:

Company Name: ${companyName}
Services Offered: ${services.join(", ")}
Years of Experience: ${experience}
Service Areas: ${areas.join(", ")}
Specialties/Certifications: ${specialties || "Not specified"}

Generate the following in JSON format:
1. "headline": A compelling headline for the homepage (max 10 words)
2. "aboutText": 2-3 paragraphs about the company (professional, trustworthy tone)
3. "serviceDescriptions": An object with each service as a key and a 1-2 sentence description as the value

Keep the tone professional but approachable. Focus on quality, reliability, and customer satisfaction.`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional copywriter. Always respond with valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating content:", error);

    // Return fallback content
    return NextResponse.json({
      headline: "Quality Contracting Services You Can Trust",
      aboutText:
        "We are a professional contracting company dedicated to delivering exceptional results on every project. With years of experience in the industry, our team of skilled professionals brings expertise and attention to detail to every job.\n\nOur commitment to quality craftsmanship and customer satisfaction has made us a trusted name in the community. We take pride in our work and stand behind everything we do.\n\nContact us today to discuss your project and discover why so many homeowners choose us for their renovation and construction needs.",
      serviceDescriptions: {},
    });
  }
}
