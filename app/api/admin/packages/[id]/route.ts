import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowed = ["name", "tagline", "price", "features", "is_popular"];
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    // If setting one as popular, clear others first
    if (updates.is_popular === true) {
      const supabase = createServerClient();
      await supabase
        .from("packages")
        .update({ is_popular: false, updated_at: new Date().toISOString() })
        .neq("id", id);
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("packages").update(updates).eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
