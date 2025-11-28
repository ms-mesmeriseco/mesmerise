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

    const { name, email, website, source } = body || {};

    // Honeypot – identical behaviour to newsletter route
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Split name into first/last like newsletter route
    const parts = String(name).trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    try {
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed: false,
        audienceId,
        // If Resend later supports metadata/tags, you could pass `source` here.
      });
    } catch (err) {
      const status = err?.statusCode || err?.response?.status;
      const code = err?.code || err?.response?.data?.name;
      if (status === 409 || code === "duplicate_contact") {
        // Still treat as success so the user gets redirected
        return NextResponse.json({ ok: true, duplicate: true });
      }
      throw err;
    }

    return NextResponse.json({ ok: true, source: source || "cro-checklist" });
  } catch (err) {
    console.error("CRO checklist route error:", {
      message: err?.message,
      name: err?.name,
      status: err?.statusCode || err?.response?.status,
      data: err?.response?.data,
      stack: err?.stack?.split("\n").slice(0, 3).join("\n"),
    });
    return NextResponse.json(
      { error: err?.message || "Failed to submit." },
      { status: 500 }
    );
  }
}
