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

    const {
      companyName,
      contractorType,
      services,
      serviceDetails,
      experience,
      teamSize,
      areas,
      specialties,
      uniqueValue,
      projectExamples
    } = answers;

    const prompt = `You are an expert copywriter specializing in contractor and trade business websites. Generate compelling, detailed website content for this contractor.

=== BUSINESS INFORMATION ===
Company Name: ${companyName}
Type of Contractor: ${contractorType || "General contractor"}
Services Offered: ${services.join(", ")}
Typical Project Details: ${serviceDetails || "Not provided"}
Experience: ${experience}
Team Size: ${teamSize || "Not specified"}
Service Areas: ${areas.join(", ")}
Certifications/Qualifications: ${specialties || "Not specified"}
Unique Value Proposition: ${uniqueValue || "Not specified"}
Recent Project Examples: ${projectExamples || "Not provided"}

=== CONTENT REQUIREMENTS ===

Generate the following in JSON format:

1. "headline": A powerful, specific headline (6-10 words) that:
   - Mentions the main service or trade
   - Includes a benefit or differentiator
   - Sounds professional and trustworthy
   - Example: "Expert Bathroom Renovations That Transform Your Home"

2. "aboutText": Write 3-4 substantial paragraphs (total 200-300 words) that:
   - First paragraph: Strong opening about who they are, what they specialize in, and their main value
   - Second paragraph: Experience, qualifications, and what makes them professional
   - Third paragraph: Their approach to work, customer service philosophy, and attention to detail
   - Fourth paragraph: Service areas and call to action
   - Use specific details from the input
   - Sound authentic and trustworthy, not generic

3. "serviceDescriptions": For EACH service listed, write a detailed description (3-5 sentences, 50-80 words each) that includes:
   - What the service involves (specific tasks and scope)
   - Materials, techniques, or methods used (if applicable)
   - Benefits to the customer
   - Why choose this company for this service
   - Make each description unique and informative, NOT generic "professional X services"

IMPORTANT:
- Be specific and detailed, use the information provided
- Avoid generic phrases like "professional services" or "quality workmanship" without context
- Each service description should read like it was written by someone who actually does this work
- Use British English spelling (colour, specialise, etc.)`;

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

    // Return fallback content - better than before but still generic
    const { answers } = await request.json().catch(() => ({ answers: {} }));
    const fallbackServices = answers?.services || [];

    return NextResponse.json({
      headline: `Expert ${answers?.contractorType || 'Contracting'} Services You Can Trust`,
      aboutText:
        `${answers?.companyName || 'Our company'} is a professional ${answers?.contractorType || 'contracting'} business with ${answers?.experience || 'years of'} experience serving ${answers?.areas?.join(', ') || 'the local area'}.\n\nWe specialise in ${fallbackServices.join(', ') || 'a range of services'}, bringing expertise and attention to detail to every project. ${answers?.specialties ? `Our team holds ${answers.specialties} certifications, ensuring quality workmanship on every job.` : ''}\n\n${answers?.uniqueValue || 'What sets us apart is our commitment to customer satisfaction and quality craftsmanship.'}\n\nContact us today to discuss your project and get a free quote.`,
      serviceDescriptions: Object.fromEntries(
        fallbackServices.map((s: string) => [
          s,
          `Our ${s.toLowerCase()} service provides comprehensive solutions tailored to your needs. We handle everything from initial consultation through to completion, using quality materials and proven techniques to deliver results that exceed expectations.`
        ])
      ),
    });
  }
}
