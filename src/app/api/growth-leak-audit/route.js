export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { computeResults, NO_LEAKS_MESSAGE } from "@/lib/quiz/scoring";
import { resultsLink } from "@/lib/quiz/resultsLink";
import {
  H1,
  H3,
  industryQuestion,
  PILLARS,
  QUALIFICATION_QUESTIONS,
  CTA,
  BOOKING_URL,
  GUIDE_URL,
  SHARE_LINK_DAYS,
  INTERNAL_LINK_DAYS,
  pillarStatus,
} from "@/lib/quiz/quizData";
import {
  upsertHubspotContact,
  hubspotContactUrl,
  LEAD_SOURCES,
} from "@/lib/hubspot";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const audienceId = process.env.RESEND_AUDIENCE_ID;
const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
// Extra recipient on the internal lead email while debugging the quiz
const DEBUG_CONTACT = "matilda@mesmeriseco.com";
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
    const marketingOptin = contact?.marketingOptin === true;
    const wantsCall = contact?.wantsCall === true;
    // 30-day link for the prospect, 90-day link for us
    const share = resultsLink(answers, SHARE_LINK_DAYS);
    const shareUrl = share && absolute(share.path);
    const internal = resultsLink(answers, INTERNAL_LINK_DAYS);
    const resultsUrl = internal && absolute(internal.path);

    const lead = {
      firstName,
      email,
      company,
      website,
      answers,
      results,
      qualAnswers,
      goalLabel,
      marketingOptin,
      wantsCall,
      resultsUrl,
      shareUrl,
    };

    // Each integration is independent: one failing shouldn't block the prospect's
    // results. The internal alert waits for HubSpot so it can link the contact.
    const tasks = await Promise.allSettled([
      syncHubspot(lead).then(
        (contactId) => sendInternalAlert(lead, contactId),
        (err) => {
          console.error("Growth leak audit HubSpot sync failed:", err?.message);
          return sendInternalAlert(lead, null);
        },
      ),
      // Nurture only with explicit opt-in
      marketingOptin ? addToAudience(lead) : null,
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

    return NextResponse.json({
      ok: true,
      shareUrl,
      shareExpires: share?.expires ?? null,
    });
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
  marketingOptin,
  wantsCall,
  resultsUrl,
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
    gla_marketing_optin: marketingOptin ? "yes" : "no",
    gla_wants_call: wantsCall ? "yes" : "no",
    gla_call_opener: results.callOpener || "",
    gla_answers: results.answers
      .map((a) => `${a.answerId || `${a.questionId}_-`} ${a.symbol} ${a.label}: ${a.answer || "-"} (${a.points})`)
      .join("\n"),
    gla_results_url: resultsUrl,
    mesm_lead_source: LEAD_SOURCES.growth_leak_audit,
  };
  for (const p of results.pillars) properties[`gla_score_${p.key}`] = p.score;

  return upsertHubspotContact(email, properties);
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

async function sendInternalAlert(
  {
    firstName,
    email,
    company,
    website,
    answers,
    results,
    qualAnswers,
    goalLabel,
    wantsCall,
    resultsUrl,
  },
  contactId,
) {
  if (!resend || !contactTo || !contactFrom) return;

  const { overall, tier, fitScore, fitBand, hotLead, pillars, leaks } = results;
  const band = hotLead ? "HOT LEAD" : `${fitBand} fit`;
  const industry = answers.H2 || "-";
  const subject = `${band}: ${company} · ${industry} · ${overall}/100 ${tier.name} · Fit ${fitScore}`;
  const hubspotUrl = await hubspotContactUrl(contactId).catch(() => null);

  const h = (title) =>
    `<h3 style="margin:28px 0 8px;font-size:13px;letter-spacing:.08em;color:#666">${escapeHtml(title)}</h3>`;
  const row = (k, v) =>
    `<tr><td style="padding:2px 12px 2px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:2px 0">${escapeHtml(v)}</td></tr>`;
  const answerLine = (a) =>
    `<li style="margin:0 0 4px"><strong>${escapeHtml(a.label)}:</strong> ${escapeHtml(a.answer || "-")}</li>`;
  const link = (href, text) =>
    `<a href="${escapeHtml(href)}" style="color:#000">${escapeHtml(text)}</a>`;

  const statusName = (score) => {
    const name = pillarStatus(score).name;
    return name === "Leaking" ? "LEAKING" : name;
  };

  const leakHtml = leaks.length
    ? leaks
        .map(
          (l, i) => `
        <p style="margin:16px 0 4px"><strong>LEAK ${i + 1}: ${escapeHtml(l.label)} · ${l.score}</strong></p>
        <ul style="margin:0;padding-left:18px">${l.lowAnswers
          .map(
            (a) =>
              `${answerLine(a)}${a.read ? `<li style="list-style:none;margin:0 0 8px;color:#555">Read: ${escapeHtml(a.read)}</li>` : ""}`,
          )
          .join("")}</ul>`,
        )
        .join("")
    : `<p>${escapeHtml(NO_LEAKS_MESSAGE)}</p>`;

  // Each qualification answer with the fit points it earned
  const FIT_LABELS = {
    revenue: "Annual revenue",
    spend: "Monthly marketing & ad spend",
    role: "Role",
    timeline: "Looking to make changes",
    current_setup: "Marketing run by",
  };
  const fitRows = QUALIFICATION_QUESTIONS.map((q) => {
    const picked = q.options[answers[q.id]];
    const max = Math.max(...q.options.map((o) => o.points));
    return row(
      FIT_LABELS[q.key] || q.question,
      picked ? `${picked.label} (${picked.points}/${max} pts)` : "-",
    );
  });

  // Every question in the quiz, in order: question text, then their answer
  const qa = (symbol, question, answer) =>
    `<li style="margin:0 0 10px">${symbol ? `${symbol} ` : ""}${escapeHtml(question)}<br/><strong>${escapeHtml(answer || "-")}</strong></li>`;
  const group = (title, items) => `
      <p style="margin:16px 0 6px"><strong>${escapeHtml(title)}</strong></p>
      <ul style="margin:0;padding-left:0;list-style:none">${items.join("")}</ul>`;
  const hookLabel = (q) =>
    q.options.find((o) => o.value === answers[q.id])?.label;

  const allAnswersHtml = [
    group("About them", [
      qa(null, H1.question, hookLabel(H1)),
      qa(null, industryQuestion(answers.H1).question, answers.H2),
      qa(null, H3.question, hookLabel(H3)),
    ]),
    ...PILLARS.map((p) =>
      group(
        pillars.find((x) => x.key === p.key)?.label || p.key,
        results.answers
          .filter((a) => a.pillar === p.key)
          .map((a) => qa(a.symbol, a.question, a.answer)),
      ),
    ),
    group(
      "Qualification",
      QUALIFICATION_QUESTIONS.map((q) =>
        qa(null, q.question, q.options[answers[q.id]]?.label),
      ),
    ),
  ].join("");

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; max-width: 680px;">
      ${results.isDecisionMaker ? "" : `<p style="background:#fff3cd;padding:8px 12px;border-radius:6px;margin:0 0 8px"><strong>Not the decision-maker. Ask who signs off.</strong></p>`}
      <p style="margin:0 0 8px;font-size:18px"><strong>Wants a call: ${wantsCall ? "Yes" : "No"}</strong></p>

      ${h("WHO")}
      <table>
        ${row("Name", firstName)}
        ${row("Role", qualAnswers.role || "-")}
        ${row("Company", company)}
        ${row("Website", website)}
        ${row("Email", email)}
        ${row("Track", TRACK_LABELS[answers.H1])}
        ${row("Industry", industry)}
        ${row("Goal", goalLabel || "-")}
      </table>

      ${h("FIT")}
      <table>
        ${fitRows.join("")}
        ${row("Fit score", `${fitScore}/100 (${fitBand})`)}
      </table>

      ${h("SCORE")}
      <table>
        ${row("Overall", `${overall}/100 ${tier.name} · Fit ${fitScore} (${fitBand})`)}
        ${pillars.map((p) => row(p.label, `${p.score} · ${statusName(p.score)}`)).join("")}
      </table>

      ${h("OPEN WITH")}
      <p style="margin:0">“${escapeHtml(results.callOpener || "-")}”</p>

      ${h("LEAKS")}
      ${leakHtml}

      ${h("NOT SURE ANSWERS")}
      ${
        results.unsure.length
          ? `<ul style="margin:0;padding-left:18px">${results.unsure.map(answerLine).join("")}</ul>`
          : "<p style=\"margin:0\">None</p>"
      }

      ${h("ALL ANSWERS")}
      ${allAnswersHtml}

      <p style="margin:32px 0 0">${[
        hubspotUrl && link(hubspotUrl, "HubSpot contact"),
        resultsUrl &&
          link(resultsUrl, `Their results page (${INTERNAL_LINK_DAYS} days)`),
      ]
        .filter(Boolean)
        .join(" · ")}</p>
    </div>
  `;

  const result = await resend.emails.send({
    to: [contactTo, secondContact, DEBUG_CONTACT].filter(Boolean),
    from: contactFrom,
    replyTo: email,
    subject,
    html,
  });
  if (result?.error) throw new Error(result.error.message || "Resend error");
}

async function sendProspectReport({ firstName, email, results, shareUrl }) {
  if (!resend || !contactFrom) return;

  const { overall, tier, pillars, leaks, fitBand } = results;
  const cta = fitBand === "Low" ? CTA.resource : CTA.call;
  // The review form sits at the base of their results page
  const ctaHref =
    fitBand === "Low"
      ? absolute(GUIDE_URL)
      : shareUrl ? `${shareUrl}#review` : absolute(BOOKING_URL);

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 600px;">
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Here’s your Growth Leak report.</p>
      <h1 style="margin:16px 0 0;font-weight:400">${overall}/100 · ${escapeHtml(tier.name)}</h1>
      <p>${escapeHtml(tier.bullets.join(" "))}</p>
      <h3 style="margin:24px 0 8px">Your scores</h3>
      <table>${pillars
        .map(
          (p) =>
            `<tr><td style="padding:4px 16px 4px 0">${escapeHtml(p.label)}</td><td><strong>${p.score}</strong></td></tr>`,
        )
        .join("")}</table>
      <h3 style="margin:24px 0 8px">${
        leaks.length === 0
          ? "Your leaks"
          : leaks.length === 1
            ? "Your biggest leak"
            : `Your top ${leaks.length} leaks`
      }</h3>
      ${
        leaks.length === 0
          ? `<p>${escapeHtml(NO_LEAKS_MESSAGE)}</p>`
          : leaks
              .map(
                (l, i) => `
        <p style="margin:0 0 20px"><strong>${i + 1}. ${escapeHtml(l.headline)}</strong><br/>
        <span style="color:#555">${escapeHtml(l.label)} · ${l.score}/100</span><br/>
        ${l.told.length ? `<strong>You told us:</strong> ${l.told.map(escapeHtml).join(" ")}<br/>` : ""}
        <strong>Why it matters:</strong> ${escapeHtml(l.why || l.cost)}<br/>
        <strong>First fix:</strong> ${escapeHtml(l.firstFix)}</p>`,
              )
              .join("")
      }
      ${
        shareUrl
          ? `<p><a href="${escapeHtml(shareUrl)}" style="color:#000">View & share your results online</a><br/>
      <span style="color:#888;font-size:12px">This link works for ${SHARE_LINK_DAYS} days.</span></p>`
          : ""
      }
      <h3 style="margin:24px 0 8px">${escapeHtml(cta.headline)}</h3>
      ${cta.body.map((b) => `<p>${escapeHtml(b)}</p>`).join("")}
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
