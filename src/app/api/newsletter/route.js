export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// You can reuse your existing envs,
// or add a dedicated NEWSLETTER_TO if you like.
const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
const contactFrom = process.env.CONTACT_FROM; // must be a verified domain/sender in Resend

export async function POST(req) {
  try {
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Server misconfig: RESEND_API_KEY is not set." },
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

    const subject = `New newsletter signup: ${name}`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
        <h2 style="margin:0 0 12px;">New newsletter signup</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <hr style="margin:16px 0;"/>
        <p style="font-size:12px;color:#666;">Captured via footer signup.</p>
      </div>
    `;

    const to = [contactTo, secondContact].filter(Boolean);
    if (!to.length) {
      return NextResponse.json(
        { error: "No recipients configured (CONTACT_TO/SECOND_CONTACT)." },
        { status: 500 }
      );
    }

    const result = await resend.emails.send({
      to,
      from: contactFrom, // e.g. "Mesmerise <noreply@yourdomain.com>"
      replyTo: email, // lets you reply directly to the subscriber
      subject,
      html,
    });

    if (!result || result.error) {
      console.error("Resend error payload:", result?.error || result);
      return NextResponse.json(
        { error: "Email provider error. Check server logs for details." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter route error:", {
      message: err?.message,
      name: err?.name,
      stack: err?.stack?.split("\n").slice(0, 3).join("\n"),
      data: err?.response?.data,
    });
    return NextResponse.json(
      { error: err?.message || "Failed to subscribe." },
      { status: 500 }
    );
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
