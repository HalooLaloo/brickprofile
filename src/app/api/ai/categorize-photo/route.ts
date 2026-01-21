import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = [
  "bathroom",
  "kitchen",
  "roofing",
  "painting",
  "flooring",
  "exterior",
  "landscaping",
  "electrical",
  "plumbing",
  "hvac",
  "general",
  "other",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert at categorizing construction and renovation project photos. Analyze the image and:
1. Categorize it into one of these categories: ${CATEGORIES.join(", ")}
2. Generate a short, professional caption (max 15 words)

Respond with JSON only: {"category": "string", "suggestedCaption": "string"}`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "low" },
            },
            {
              type: "text",
              text: "Categorize this construction/renovation photo and suggest a caption.",
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    const parsed = JSON.parse(content);

    // Validate category
    if (!CATEGORIES.includes(parsed.category)) {
      parsed.category = "general";
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error categorizing photo:", error);

    // Return fallback
    return NextResponse.json({
      category: "general",
      suggestedCaption: "Completed project",
    });
  }
}
