export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { computeResults } from "@/lib/quiz/scoring";
import { verifyResultsToken } from "@/lib/quiz/resultsLink";
import { upsertHubspotContact, LEAD_SOURCES } from "@/lib/hubspot";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
const contactFrom = process.env.CONTACT_FROM;
// Extra recipient while debugging the quiz (matches the lead email)
const DEBUG_CONTACT = "matilda@mesmeriseco.com";

// Growth Leak Review request from the CTA at the base of the results page
export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }
    if (body.hp) return NextResponse.json({ ok: true });

    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "")
      .trim()
      .slice(0, 2000);
    const resultsUrl = String(body.resultsUrl || "");

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email and phone are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // The score only goes in the email if the results link checks out
    const link = verifyResultsToken(resultsUrl.split("/").pop());
    const results = link?.answers ? computeResults(link.answers) : null;

    const tasks = await Promise.allSettled([
      upsertHubspotContact(email, {
        firstname: name,
        phone,
        company,
        gla_wants_call: "yes",
        mesm_lead_source: LEAD_SOURCES.growth_leak_audit,
      }),
      sendRequest({
        name,
        email,
        phone,
        company,
        message,
        resultsUrl,
        results,
      }),
    ]);
    tasks.forEach((t, i) => {
      if (t.status === "rejected") {
        console.error(
          `Growth leak review task ${i} failed:`,
          t.reason?.message || t.reason,
        );
      }
    });
    // The email is the request itself, so it has to succeed
    if (tasks[1].status === "rejected") {
      return NextResponse.json(
        { error: "Failed to send. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Growth leak review route error:", err?.message);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}

async function sendRequest({
  name,
  email,
  phone,
  company,
  message,
  resultsUrl,
  results,
}) {
  if (!resend || !contactTo || !contactFrom) {
    throw new Error("Email isn't configured");
  }

  const row = (k, v) =>
    `<tr><td style="padding:2px 12px 2px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:2px 0">${escapeHtml(v)}</td></tr>`;
  const score = results
    ? `${results.overall}/100 ${results.tier.name} · Fit ${results.fitScore} (${results.fitBand})`
    : null;

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; max-width: 680px;">
      <h2 style="margin:0 0 16px">Growth Leak Review request</h2>
      <table>
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Phone", phone)}
        ${row("Company", company || "-")}
        ${score ? row("Score", score) : ""}
      </table>
      <p style="margin:16px 0 4px"><strong>Message</strong></p>
      <p style="margin:0">${escapeHtml(message || "-").replace(/\n/g, "<br/>")}</p>
      ${
        results
          ? `<p style="margin:24px 0 0"><a href="${escapeHtml(resultsUrl)}" style="color:#000">Their results page</a></p>`
          : ""
      }
    </div>
  `;

  const result = await resend.emails.send({
    to: [contactTo, secondContact, DEBUG_CONTACT].filter(Boolean),
    from: contactFrom,
    replyTo: email,
    subject: `Growth Leak Review request: ${name}${company ? ` (${company})` : ""}${score ? ` · ${score}` : ""}`,
    html,
  });
  if (result?.error) throw new Error(result.error.message || "Resend error");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
