import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  // Parse body first so we can use it in catch block
  const body = await request.json().catch(() => ({}));
  const { contractorType, services } = body;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: "Services are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert in the construction and contracting industry. A ${contractorType || "contractor"} has listed these services: ${services.join(", ")}.

Your task is to expand these services into specific, detailed sub-services that customers would actually search for and understand.

For example:
- "Bathroom renovation" should expand to: Tile installation, Plumbing fixtures, Shower installation, Bathtub installation, Vanity installation, Bathroom flooring, Waterproofing, Bathroom lighting, Mirror installation, Heated towel rails
- "Kitchen fitting" should expand to: Kitchen cabinet installation, Worktop fitting, Sink installation, Tap fitting, Kitchen tiling, Appliance installation, Kitchen lighting, Splashback installation, Kitchen flooring
- "Roofing" should expand to: Roof repairs, Flat roofing, Pitched roofing, Roof tile replacement, Guttering, Fascias and soffits, Roof insulation, Chimney repairs, Skylight installation

Rules:
1. Include ALL the original services the user mentioned
2. Add 3-8 specific sub-services for each general service
3. Keep service names short (2-4 words max)
4. Use common terms customers would search for
5. Don't repeat services
6. Maximum 25 total services
7. Sort alphabetically

Return ONLY a JSON object with this format:
{
  "expandedServices": ["Service 1", "Service 2", "Service 3", ...]
}`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a construction industry expert. Always respond with valid JSON only, no markdown formatting.",
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
    console.error("Error expanding services:", error);

    // Return original services as fallback
    return NextResponse.json({
      expandedServices: services || [],
    });
  }
}
