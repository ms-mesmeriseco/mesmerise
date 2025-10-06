export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const audienceId = process.env.RESEND_AUDIENCE_ID;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req) {
  try {
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Server misconfig: RESEND_API_KEY is not set." },
        { status: 500 }
      );
    }
    if (!audienceId) {
      return NextResponse.json(
        { error: "Server misconfig: RESEND_AUDIENCE_ID is not set." },
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

    // Create (or upsert) contact in Resend Audience
    // If you want true upsert behavior, Resend supports `updateIfExists: true`
    // on some SDK versions. If not available, catching 409 works fine.
    try {
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed: false,
        audienceId,
      });
    } catch (err) {
      // If already exists, treat as success so the UI can thank the user
      const status = err?.statusCode || err?.response?.status;
      const code = err?.code || err?.response?.data?.name;
      if (status === 409 || code === "duplicate_contact") {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      // Otherwise bubble up
      throw err;
    }

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
      { error: err?.message || "Failed to subscribe." },
      { status: 500 }
    );
  }
}
