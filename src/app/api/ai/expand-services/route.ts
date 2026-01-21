import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  // Parse body first so we can use it in catch block
  const body = await request.json().catch(() => ({}));
  const { contractorType, services } = body;

  console.log("Expand services request:", { contractorType, services });

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Unauthorized - no user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      console.log("No services provided");
      return NextResponse.json(
        { error: "Services are required" },
        { status: 400 }
      );
    }

    const prompt = `A ${contractorType || "contractor"} offers: ${services.join(", ")}

Break down each service into specific tasks a customer would understand and search for.

Example input: "Bathroom renovation"
Example output: Bathroom renovation, Tile installation, Plumbing fixtures, Shower installation, Bathtub fitting, Vanity units, Bathroom flooring, Waterproofing, Bathroom electrics, Underfloor heating

Example input: "Kitchen fitting"
Example output: Kitchen fitting, Cabinet installation, Worktop fitting, Sink & tap installation, Kitchen tiling, Appliance fitting, Kitchen electrics, Splashback installation

For the services listed above, generate 15-25 specific services total. Include the original services plus detailed sub-tasks for each.

Return JSON: {"expandedServices": ["Service 1", "Service 2", ...]}`;

    console.log("Calling OpenAI with prompt length:", prompt.length);

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You expand contractor services into specific sub-services. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    console.log("OpenAI response:", content);

    if (!content) {
      throw new Error("No content generated");
    }

    const parsed = JSON.parse(content);
    console.log("Parsed services count:", parsed.expandedServices?.length);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error expanding services:", error);

    // Return original services as fallback
    return NextResponse.json({
      expandedServices: services || [],
    });
  }
}
