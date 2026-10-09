export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { upsertHubspotContact, LEAD_SOURCES } from "@/lib/hubspot";

export async function POST(req) {
  try {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Server misconfig: HUBSPOT_ACCESS_TOKEN is not set." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    // Honeypot
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const { name, email } = body || {};
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Split "name" into first/last (best-effort)
    const parts = String(name).trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    // HubSpot is the mailing list, so a failed sync fails the signup
    await upsertHubspotContact(email, {
      firstname: firstName,
      lastname: lastName,
      mesm_lead_source: LEAD_SOURCES.newsletter,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter route error:", {
      message: err?.message,
      name: err?.name,
      status: err?.statusCode || err?.response?.status,
      data: err?.response?.data,
      stack: err?.stack?.split("\n").slice(0, 3).join("\n"),
    });
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
