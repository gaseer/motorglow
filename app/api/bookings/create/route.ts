import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { createServerClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/resend";
import { CreateBookingPayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);
    const { uid, phone_number } = decoded;

    const body: CreateBookingPayload = await request.json();
    const { package_id, package_name, vehicle, location, notes, date, time_slot } = body;

    if (!package_id || !package_name || !vehicle || !location || !date || !time_slot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        firebase_uid: uid,
        customer_phone: phone_number || null,
        package_id,
        package_name,
        vehicle,
        location,
        notes: notes || null,
        date,
        time_slot,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Fetch package for price
    const { data: pkg } = await supabase
      .from("packages")
      .select("price")
      .eq("id", package_id)
      .single();

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    if (phone_number) {
      sendConfirmationEmail({
        to: `${phone_number}@example.com`, // SMS fallback — swap for real email when collected
        bookingId: booking.id,
        packageName: package_name,
        date,
        timeSlot: time_slot,
        location,
        vehicle,
        price: pkg?.price || 0,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("/api/bookings/create error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
