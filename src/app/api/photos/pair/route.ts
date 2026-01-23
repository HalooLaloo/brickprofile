import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { beforePhotoId, afterPhotoId } = await request.json();

    if (!beforePhotoId || !afterPhotoId) {
      return NextResponse.json(
        { error: "Both beforePhotoId and afterPhotoId are required" },
        { status: 400 }
      );
    }

    // Verify both photos belong to user
    const { data: photos } = await supabase
      .from("ps_photos")
      .select("id, user_id")
      .in("id", [beforePhotoId, afterPhotoId]);

    if (!photos || photos.length !== 2) {
      return NextResponse.json({ error: "Photos not found" }, { status: 404 });
    }

    if (photos.some((p) => p.user_id !== user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Generate a pair_id
    const pair_id = crypto.randomUUID();

    // Update before photo
    const { error: beforeError } = await supabase
      .from("ps_photos")
      .update({
        is_before_after: true,
        pair_id,
        is_before: true,
      })
      .eq("id", beforePhotoId);

    if (beforeError) throw beforeError;

    // Update after photo
    const { error: afterError } = await supabase
      .from("ps_photos")
      .update({
        is_before_after: true,
        pair_id,
        is_before: false,
      })
      .eq("id", afterPhotoId);

    if (afterError) throw afterError;

    return NextResponse.json({ success: true, pair_id });
  } catch (error) {
    console.error("Error creating photo pair:", error);
    return NextResponse.json(
      { error: "Failed to create photo pair" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pair_id } = await request.json();

    if (!pair_id) {
      return NextResponse.json(
        { error: "pair_id is required" },
        { status: 400 }
      );
    }

    // Verify photos belong to user
    const { data: photos } = await supabase
      .from("ps_photos")
      .select("id, user_id")
      .eq("pair_id", pair_id);

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "Pair not found" }, { status: 404 });
    }

    if (photos.some((p) => p.user_id !== user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Remove pairing from both photos
    const { error } = await supabase
      .from("ps_photos")
      .update({
        is_before_after: false,
        pair_id: null,
        is_before: null,
      })
      .eq("pair_id", pair_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing photo pair:", error);
    return NextResponse.json(
      { error: "Failed to remove photo pair" },
      { status: 500 }
    );
  }
}
