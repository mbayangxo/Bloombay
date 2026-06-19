import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orgName, orgType, programName, contactEmail, description, sourceUrl } = body;

    // Validation
    if (!orgName || typeof orgName !== "string" || orgName.trim().length < 2) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }
    if (!programName || typeof programName !== "string" || programName.trim().length < 2) {
      return NextResponse.json({ error: "Program name is required" }, { status: 400 });
    }
    if (!contactEmail || typeof contactEmail !== "string") {
      return NextResponse.json({ error: "Contact email is required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail.trim())) {
      return NextResponse.json({ error: "Invalid contact email address" }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length < 20) {
      return NextResponse.json({ error: "Description must be at least 20 characters" }, { status: 400 });
    }
    if (!sourceUrl || typeof sourceUrl !== "string") {
      return NextResponse.json({ error: "Program URL is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("program_submissions")
      .insert({
        org_name: orgName.trim(),
        org_type: orgType || null,
        program_name: programName.trim(),
        contact_email: contactEmail.trim().toLowerCase(),
        description: description.trim(),
        source_url: sourceUrl.trim(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[b2b/submit] Supabase error:", error);
      return NextResponse.json({ error: "Failed to submit program" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message:
        "Your program has been submitted for review. Our team will verify and publish it within 3–5 business days. We'll notify you at " +
        contactEmail.trim().toLowerCase(),
    });
  } catch (error) {
    console.error("[b2b/submit] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
