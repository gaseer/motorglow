import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);
    const { uid, phone_number } = decoded;

    const supabase = createServerClient();

    const { error } = await supabase.from("customers").upsert(
      {
        firebase_uid: uid,
        phone: phone_number || null,
      },
      { onConflict: "firebase_uid" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true, uid });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("/api/auth/sync-user error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
