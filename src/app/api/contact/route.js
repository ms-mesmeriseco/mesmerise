export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
const contactFrom = process.env.CONTACT_FROM;

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

    const { fullName, email, phone, company, services, budgets, details } =
      body;
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const subject = `Mesmerise Connect Submission from ${fullName}`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">
        <h2 style="margin:0 0 16px">New enquiry</h2>
        <p><strong>Full name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone number:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "-")}</p>
        <p><strong>Services:</strong> ${
          Array.isArray(services) && services.length
            ? services.map(escapeHtml).join(", ")
            : "-"
        }</p>
        <p><strong>Budget:</strong> ${
          Array.isArray(budgets) && budgets.length
            ? budgets.map(escapeHtml).join(", ")
            : "-"
        }</p>
        <p><strong>Details:</strong><br/>${escapeHtml(details || "-").replace(
          /\n/g,
          "<br/>"
        )}</p>
        <hr/>
        <p style="font-size:12px;color:#666;">This email was sent from the website contact form.</p>
      </div>
    `;

    // Attempt send
    const result = await resend.emails.send({
      to: [contactTo, secondContact],
      from: contactFrom,
      replyTo: email,
      subject,
      html,
    });

    // Resend returns { id } or throws; but just in case:
    if (!result || result.error) {
      console.error("Resend error payload:", result?.error || result);
      return NextResponse.json(
        { error: "Email provider error. Check server logs for details." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log a concise version server-side
    console.error("Contact route error:", {
      message: err?.message,
      name: err?.name,
      stack: err?.stack?.split("\n").slice(0, 3).join("\n"),
      // Some providers include a response body:
      data: err?.response?.data,
    });

    // Show a safer message to client
    return NextResponse.json(
      { error: err?.message || "Failed to send message." },
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
