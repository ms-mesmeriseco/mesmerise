export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { computeResults } from "@/lib/quiz/scoring";
import {
  H3,
  QUALIFICATION_QUESTIONS,
  CTA,
  BOOKING_URL,
  GUIDE_URL,
} from "@/lib/quiz/quizData";
import { upsertHubspotContact, LEAD_SOURCES } from "@/lib/hubspot";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const audienceId = process.env.RESEND_AUDIENCE_ID;
const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
const contactFrom = process.env.CONTACT_FROM;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mesmeriseco.com";

const TRACK_LABELS = { leadgen: "Lead gen", ecom: "Ecom", both: "Both" };

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const { answers, contact, hp } = body;

    // Honeypot
    if (hp) return NextResponse.json({ ok: true });

    const firstName = String(contact?.firstName || "").trim();
    const email = String(contact?.email || "")
      .trim()
      .toLowerCase();
    const company = String(contact?.company || "").trim();
    let website = String(contact?.website || "").trim();

    if (!firstName || !email || !company || !website) {
      return NextResponse.json(
        { error: "First name, email, company and website are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }
    if (!/^https?:\/\//i.test(website)) website = `https://${website}`;

    if (!answers || !TRACK_LABELS[answers.H1]) {
      return NextResponse.json(
        { error: "Incomplete quiz answers." },
        { status: 400 },
      );
    }

    // Scores are always recomputed server-side
    const results = computeResults(answers);
    const qualAnswers = Object.fromEntries(
      QUALIFICATION_QUESTIONS.map((q) => [
        q.key,
        q.options[answers[q.id]]?.label || "",
      ]),
    );
    const goalLabel =
      H3.options.find((o) => o.value === answers.H3)?.label || "";

    const lead = {
      firstName,
      email,
      company,
      website,
      answers,
      results,
      qualAnswers,
      goalLabel,
    };

    // Each integration is independent: one failing shouldn't block the prospect's results
    const tasks = await Promise.allSettled([
      syncHubspot(lead),
      addToAudience(lead),
      sendInternalAlert(lead),
      sendProspectReport(lead),
    ]);
    tasks.forEach((t, i) => {
      if (t.status === "rejected") {
        console.error(
          `Growth leak audit task ${i} failed:`,
          t.reason?.message || t.reason,
        );
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Growth leak audit route error:", {
      message: err?.message,
      stack: err?.stack?.split("\n").slice(0, 3).join("\n"),
    });
    return NextResponse.json({ error: "Failed to submit." }, { status: 500 });
  }
}

// ── HubSpot ────────────────────────────────────────────────────────────────

async function syncHubspot({
  firstName,
  email,
  company,
  website,
  answers,
  results,
  qualAnswers,
}) {
  const properties = {
    firstname: firstName,
    company,
    website,
    gla_track: answers.H1,
    gla_industry: answers.H2 || "",
    gla_goal: answers.H3 || "",
    gla_score_overall: results.overall,
    gla_tier: results.tier.name,
    gla_weakest_pillar: results.weakestPillar.key,
    gla_fit_score: results.fitScore,
    gla_fit_band: results.fitBand,
    gla_hot_lead: results.hotLead ? "true" : "false",
    gla_revenue: qualAnswers.revenue,
    gla_spend: qualAnswers.spend,
    gla_role: qualAnswers.role,
    gla_timeline: qualAnswers.timeline,
    gla_current_setup: qualAnswers.current_setup,
    mesm_lead_source: LEAD_SOURCES.growth_leak_audit,
  };
  for (const p of results.pillars) properties[`gla_score_${p.key}`] = p.score;

  await upsertHubspotContact(email, properties);
}

// ── Resend ─────────────────────────────────────────────────────────────────

async function addToAudience({ firstName, email }) {
  if (!resend || !audienceId) return;
  try {
    await resend.contacts.create({
      email,
      firstName,
      unsubscribed: false,
      audienceId,
    });
  } catch (err) {
    const status = err?.statusCode || err?.response?.status;
    if (status !== 409) throw err;
  }
}

async function sendInternalAlert({
  firstName,
  email,
  company,
  website,
  answers,
  results,
  qualAnswers,
  goalLabel,
}) {
  if (!resend || !contactTo || !contactFrom) return;

  const { overall, tier, fitScore, fitBand, hotLead, pillars, leaks } = results;
  const prefix = hotLead ? "HOT LEAD" : `${fitBand} fit`;
  const subject = `${prefix}: Growth Leak Audit from ${company} (${overall}/100, fit ${fitScore})`;

  const row = (k, v) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`;

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">
      <h2 style="margin:0 0 16px">${escapeHtml(prefix)}</h2>
      ${hotLead ? `<p style="background:#fff3cd;padding:8px 12px;border-radius:6px"><strong>Low diagnostic score + high fit.</strong> Plenty of leaks and the budget to fix them.</p>` : ""}
      <table>
        ${row("Name", firstName)}
        ${row("Email", email)}
        ${row("Company", company)}
        ${row("Website", website)}
        ${row("Track", TRACK_LABELS[answers.H1])}
        ${row("Industry", answers.H2 || "-")}
        ${row("Goal", goalLabel || "-")}
        ${row("Overall score", `${overall} (${tier.name})`)}
        ${row("Fit score", `${fitScore} (${fitBand})`)}
        ${row("Revenue", qualAnswers.revenue)}
        ${row("Monthly spend", qualAnswers.spend)}
        ${row("Role", qualAnswers.role)}
        ${row("Timeline", qualAnswers.timeline)}
        ${row("Marketing run by", qualAnswers.current_setup)}
      </table>
      <h3 style="margin:24px 0 8px">Pillars</h3>
      <table>${pillars.map((p) => row(p.label, p.score)).join("")}</table>
      <h3 style="margin:24px 0 8px">Top 3 leaks</h3>
      <ol>${leaks.map((l) => `<li>${escapeHtml(l.label)} (${l.score})</li>`).join("")}</ol>
    </div>
  `;

  const result = await resend.emails.send({
    to: [contactTo, secondContact].filter(Boolean),
    from: contactFrom,
    replyTo: email,
    subject,
    html,
  });
  if (result?.error) throw new Error(result.error.message || "Resend error");
}

async function sendProspectReport({ firstName, email, answers, results }) {
  if (!resend || !contactFrom) return;

  const { overall, tier, pillars, leaks, fitBand } = results;
  const cta = fitBand === "Low" ? CTA.resource : CTA.call;
  const ctaHref = absolute(fitBand === "Low" ? GUIDE_URL : BOOKING_URL);

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 600px;">
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Here’s your Growth Leak report.</p>
      <h1 style="margin:16px 0 0;font-weight:400">${overall}/100 · ${escapeHtml(tier.name)}</h1>
      <p>${escapeHtml(tier.copy)}</p>
      <h3 style="margin:24px 0 8px">Your scores</h3>
      <table>${pillars
        .map(
          (p) =>
            `<tr><td style="padding:4px 16px 4px 0">${escapeHtml(p.label)}</td><td><strong>${p.score}</strong></td></tr>`,
        )
        .join("")}</table>
      <h3 style="margin:24px 0 8px">Your top 3 leaks</h3>
      ${leaks
        .map(
          (l, i) => `
        <p style="margin:0 0 16px"><strong>${i + 1}. ${escapeHtml(l.headline)}</strong><br/>
        <span style="color:#555">${escapeHtml(l.label)} · ${l.score}/100</span><br/>
        ${escapeHtml(l.cost)}</p>`,
        )
        .join("")}
      <h3 style="margin:24px 0 8px">${escapeHtml(cta.headline)}</h3>
      <p>${escapeHtml(cta.body)}</p>
      <p><a href="${escapeHtml(ctaHref)}" style="display:inline-block;background:#000;color:#c1d2fc;padding:10px 20px;border-radius:16px;text-decoration:none">${escapeHtml(cta.button)}</a></p>
      <p style="color:#888;font-size:12px;margin-top:32px">Mesmerise Digital · You’re receiving this because you completed the Growth Leak Audit.</p>
    </div>
  `;

  const result = await resend.emails.send({
    to: [email],
    from: contactFrom,
    subject: `Your Growth Leak report: ${overall}/100 (${tier.name})`,
    html,
  });
  if (result?.error) throw new Error(result.error.message || "Resend error");
}

function absolute(url) {
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url}`;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
