export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { computeResults, isHotLead } from "@/lib/cmo-benchmark/scoring";
import { verifyResultsToken } from "@/lib/cmo-benchmark/resultsLink";
import { CTA } from "@/lib/cmo-benchmark/quizData";
import {
  upsertHubspotContact,
  updateHubspotContactBy,
  splitName,
  LEAD_SOURCES,
} from "@/lib/hubspot";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
const contactFrom = process.env.CONTACT_FROM;
// Optional: gets a copy of every team email, for checking what the team sees
const debugContact = process.env.DEBUG_CONTACT;

// Strategy session request from the CTA at the base of the results page
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

    const name = String(body.fullName || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "")
      .trim()
      .slice(0, 2000);
    const bestTime = CTA.session.form.bestTimes.includes(body.bestTime)
      ? body.bestTime
      : "";
    const quizId = String(body.quizId || "").trim();
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
      syncHubspot({ name, email, phone, company, bestTime, quizId }),
      sendRequest({
        name,
        email,
        phone,
        company,
        bestTime,
        message,
        resultsUrl,
        results,
      }),
    ]);
    tasks.forEach((t, i) => {
      if (t.status === "rejected") {
        console.error(
          `CMO benchmark session task ${i} failed:`,
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
    console.error("CMO benchmark session route error:", err?.message);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}

// Lands on the quiz's HubSpot contact via its quiz ID. Without one (e.g. a
// shared results link), or if it doesn't match, falls back to the email.
async function syncHubspot({ name, email, phone, company, bestTime, quizId }) {
  const session = {
    phone,
    cmo_session_requested: "yes",
    cmo_session_best_time: bestTime,
  };
  const id = await updateHubspotContactBy("cmo_quiz_id", quizId, session);
  if (id) return id;
  return upsertHubspotContact(email, {
    ...splitName(name),
    company,
    ...session,
    mesm_lead_source: LEAD_SOURCES.cmo_benchmark,
  });
}

async function sendRequest({
  name,
  email,
  phone,
  company,
  bestTime,
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
  // A session request completes the hottest-lead set
  const hot = results && isHotLead(results, true);

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; max-width: 680px;">
      ${hot ? `<p style="background:#ffd6d6;padding:8px 12px;border-radius:6px;margin:0 0 8px"><strong>Hottest lead. Same-day outreach.</strong></p>` : ""}
      ${results?.agencyReview ? `<p style="background:#ffe8c2;padding:8px 12px;border-radius:6px;margin:0 0 8px"><strong>Agency under review</strong></p>` : ""}
      <h2 style="margin:0 0 16px">CMO Benchmark strategy session request</h2>
      <table>
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Phone", phone)}
        ${row("Company", company || "-")}
        ${row("Best time", bestTime || "-")}
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
    to: [contactTo, secondContact, debugContact].filter(Boolean),
    from: contactFrom,
    replyTo: email,
    subject: `${hot ? "HOTTEST LEAD · " : ""}CMO Benchmark session request: ${name}${company ? ` (${company})` : ""}${score ? ` · ${score}` : ""}`,
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
