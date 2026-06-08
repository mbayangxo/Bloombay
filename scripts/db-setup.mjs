#!/usr/bin/env node
/**
 * Applies waitlist schema (needs DATABASE_URL or Supabase SQL Editor)
 * and optional seed rows (needs SUPABASE_SERVICE_ROLE_KEY).
 *
 * Usage:
 *   node --env-file=.env.local scripts/db-setup.mjs
 *   node --env-file=.env.local scripts/db-setup.mjs --seed
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const seed = process.argv.includes("--seed");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

function loadSql(name) {
  return readFileSync(join(root, "supabase", "migrations", name), "utf8");
}

async function applySqlWithPg() {
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(loadSql("000_waitlist_table.sql"));
    console.log("✓ Applied 000_waitlist_table.sql via DATABASE_URL");
  } finally {
    await client.end();
  }
}

async function checkTable(client) {
  const { error } = await client.from("waitlist").select("id").limit(1);
  return error;
}

async function runSeed(admin) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  const torontoMembers = Array.from({ length: 12 }, (_, i) => ({
    signup_type: "member",
    status: i < 3 ? "new" : "reviewed",
    first_name: i === 0 ? "Maya" : `Toronto Member ${i + 1}`,
    email: `toronto${i + 1}@example.bloombay.test`,
    phone: "",
    neighborhood: i % 2 === 0 ? "Queen West" : "Yorkville",
    city: "Toronto",
    state: "Ontario",
    country: "Canada",
    age_range: "25–30",
    reasons: ["friends", "events"],
    interests: [
      ["book-clubs"],
      ["dinner-clubs"],
      ["wellness"],
      ["travel"],
      ["entrepreneurship"],
    ][i % 5],
    founding_mother: false,
    extra_notes: "",
    created_at: new Date(now - (i + 2) * hour).toISOString(),
  }));

  const rows = [
    {
      signup_type: "member",
      status: "new",
      first_name: "Sarah",
      email: "sarah@example.bloombay.test",
      phone: "+1 718 555 0142",
      neighborhood: "Brooklyn",
      city: "New York",
      state: "New York",
      country: "United States",
      age_range: "31–35",
      reasons: ["book-club", "friends"],
      interests: ["book-clubs", "dinner-clubs"],
      founding_mother: false,
      extra_notes: "Joined from Brooklyn",
      created_at: new Date(now - hour).toISOString(),
    },
    {
      signup_type: "club_host",
      status: "new",
      first_name: "Priya",
      email: "priya.club@example.bloombay.test",
      phone: "+1 212 555 0198",
      city: "New York",
      state: "New York",
      country: "United States",
      club_name: "Brooklyn Book & Wine Club",
      club_platform: "instagram",
      club_member_count: "500-1K",
      club_women_only: true,
      extra_notes: "Book club host application",
      created_at: new Date(now - 2 * hour).toISOString(),
    },
    {
      signup_type: "partner",
      status: "new",
      first_name: "Elena",
      email: "elena.venue@example.bloombay.test",
      phone: "+1 416 555 0100",
      city: "Toronto",
      state: "Ontario",
      country: "Canada",
      business_name: "The Rose Room",
      business_type: "venue",
      business_socials: "@theroseroomto",
      offering: "Private dining and salon nights for women",
      extra_notes: "New venue partner application",
      created_at: new Date(now - 3 * hour).toISOString(),
    },
    ...torontoMembers,
  ];

  console.log(`Seeding ${rows.length} waitlist rows…`);
  const chunk = 500;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const { error } = await admin.from("waitlist").insert(slice);
    if (error) throw error;
    console.log(`  inserted ${Math.min(i + chunk, rows.length)} / ${rows.length}`);
  }
  console.log("✓ Seed complete");
}

async function main() {
  if (!url) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
    process.exit(1);
  }

  console.log("Supabase project:", url);

  if (databaseUrl) {
    try {
      await applySqlWithPg();
    } catch (e) {
      console.error("DATABASE_URL migration failed:", e.message);
    }
  } else {
    console.log(
      "\nNo DATABASE_URL set. Paste supabase/migrations/000_waitlist_table.sql into:\n" +
        "  Supabase Dashboard → SQL Editor → Run\n"
    );
  }

  const probeKey = serviceKey ?? anonKey;
  if (!probeKey) {
    console.error("Missing Supabase API key in .env.local");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey ?? anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const tableError = await checkTable(admin);
  if (tableError) {
    console.error("\nWaitlist table not ready:", tableError.message);
    if (!serviceKey) {
      console.error(
        "\nAdd SUPABASE_SERVICE_ROLE_KEY to .env.local for the founder dashboard.\n" +
          "(Supabase → Project Settings → API → service_role secret)\n"
      );
    }
    if (!databaseUrl) {
      console.log("Then re-run: node --env-file=.env.local scripts/db-setup.mjs --seed");
    }
    process.exit(1);
  }

  console.log("✓ public.waitlist is reachable");

  if (!serviceKey) {
    console.warn(
      "\nWarning: SUPABASE_SERVICE_ROLE_KEY missing — dashboard reads may fail (RLS).\n"
    );
    process.exit(0);
  }

  if (seed) {
    const { count, error: countErr } = await admin
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    if (countErr) throw countErr;
    if (count > 0) {
      console.log(`Skipping seed — table already has ${count} rows.`);
      console.log("To re-seed, truncate waitlist in SQL Editor first.");
      return;
    }
    await runSeed(admin);
  } else {
    console.log("Run with --seed to insert Brooklyn / Toronto / partner demo rows.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
