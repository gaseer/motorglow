/**
 * Seed script: inserts the 3 default MotorGlow packages into Supabase.
 * Run: npx tsx scripts/seed.ts
 *
 * Prerequisites: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * must be set in your environment (or in .env.local).
 */

import { config } from "dotenv";
// Load .env.local
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const packages = [
  {
    name: "Shell Shine",
    tagline: "A spotless exterior, every time.",
    price: 999,
    features: [
      "Full exterior hand wash",
      "Wheel & tyre clean",
      "Window wipe-down",
      "Exterior mirror clean",
    ],
    is_popular: false,
    sort_order: 1,
  },
  {
    name: "Full Refresh",
    tagline: "Inside out, front to back.",
    price: 1999,
    features: [
      "Everything in Shell Shine",
      "Full interior vacuum",
      "Dashboard & console wipe",
      "Door panel clean",
      "Interior glass polish",
    ],
    is_popular: true,
    sort_order: 2,
  },
  {
    name: "MotorGlow Premium",
    tagline: "The full detail. Nothing missed.",
    price: 3499,
    features: [
      "Everything in Full Refresh",
      "Foam pre-wash & clay bar",
      "Seat shampooing",
      "Engine bay wipe",
      "Air freshener finish",
      "Post-wash inspection report",
    ],
    is_popular: false,
    sort_order: 3,
  },
];

async function seed() {
  console.log("🌱 Seeding packages table…");

  const { data: existing } = await supabase.from("packages").select("id");
  if (existing && existing.length > 0) {
    console.log(`⚠️  Packages table already has ${existing.length} row(s). Skipping seed.`);
    console.log("   If you want to re-seed, delete existing rows first.");
    return;
  }

  const { error } = await supabase.from("packages").insert(packages);

  if (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }

  console.log("✅ Seeded 3 packages successfully!");
}

seed();
