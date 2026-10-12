export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  computeResults,
  isHotLead,
  leadershipSummary,
  industryLabel,
  businessTypeLabel,
  pressureLabel,
  pickAnswers,
} from "@/lib/cmo-benchmark/scoring";
import { resultsLink } from "@/lib/cmo-benchmark/resultsLink";
import {
  H1,
  H2,
  H3,
  PILLARS,
  QUALIFICATION_QUESTIONS,
  PRESSURE_HEADLINES,
  NO_PRIORITIES_MESSAGE,
  CTA,
  BOOKING_URL,
  SHARE_LINK_DAYS,
  INTERNAL_LINK_DAYS,
  pillarStatus,
  isWorkEmail,
} from "@/lib/cmo-benchmark/quizData";
import {
  upsertHubspotContact,
  hubspotContactUrl,
  LEAD_SOURCES,
} from "@/lib/hubspot";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const contactTo = process.env.CONTACT_TO;
const secondContact = process.env.SECOND_CONTACT;
const contactFrom = process.env.CONTACT_FROM;
// Optional: gets a copy of every team email, for checking what the team sees
const debugContact = process.env.DEBUG_CONTACT;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mesmeriseco.com";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const { contact, hp } = body;

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
    if (!isWorkEmail(email)) {
      return NextResponse.json(
        { error: "Please use your work email." },
        { status: 400 },
      );
    }
    if (!/^https?:\/\//i.test(website)) website = `https://${website}`;

    if (
      !body.answers ||
      !H1.options.some((o) => o.value === body.answers.H1)
    ) {
      return NextResponse.json(
        { error: "Incomplete quiz answers." },
        { status: 400 },
      );
    }
    const answers = pickAnswers(body.answers);

    // Scores are always recomputed server-side
    const results = computeResults(answers);
    const qualAnswers = Object.fromEntries(
      QUALIFICATION_QUESTIONS.map((q) => [
        q.key,
        q.options[answers[q.id]]?.label || "",
      ]),
    );
    const marketingOptin = contact?.marketingOptin === true;
    const sessionRequested = contact?.sessionRequested === true;
    const hotLead = isHotLead(results, sessionRequested);
    // Ties a later session request back to this HubSpot contact
    const quizId = randomUUID();

    // 30-day link for the prospect, 90-day link for us
    const who = { firstName, company };
    const share = resultsLink(answers, who, SHARE_LINK_DAYS);
    const shareUrl = share && absolute(share.path);
    const internal = resultsLink(answers, who, INTERNAL_LINK_DAYS);
    const resultsUrl = internal && absolute(internal.path);

    const lead = {
      firstName,
      email,
      company,
      website,
      answers,
      results,
      qualAnswers,
      marketingOptin,
      sessionRequested,
      hotLead,
      resultsUrl,
      shareUrl,
      quizId,
    };

    // Each integration is independent: one failing shouldn't block the prospect's
    // results. The lead email waits for HubSpot so it can link the contact.
    const tasks = await Promise.allSettled([
      syncHubspot(lead).then(
        (contactId) => sendLeadEmail(lead, contactId),
        (err) => {
          console.error("CMO benchmark HubSpot sync failed:", err?.message);
          return sendLeadEmail(lead, null);
        },
      ),
      sendProspectReport(lead),
    ]);
    tasks.forEach((t, i) => {
      if (t.status === "rejected") {
        console.error(
          `CMO benchmark task ${i} failed:`,
          t.reason?.message || t.reason,
        );
      }
    });

    return NextResponse.json({
      ok: true,
      shareUrl,
      shareExpires: share?.expires ?? null,
      quizId,
    });
  } catch (err) {
    console.error("CMO benchmark route error:", {
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
  sessionRequested,
  hotLead,
  resultsUrl,
  quizId,
}) {
  const properties = {
    firstname: firstName,
    company,
    website,
    cmo_business_type: answers.H1,
    cmo_industry: answers.H2 || "",
    cmo_industry_other: answers.H2_other || "",
    cmo_pressure: answers.H3 || "",
    cmo_score_overall: results.overall,
    cmo_tier: results.tier.name,
    cmo_weakest_pillar: results.weakestPillar.key,
    // Multi-checkbox values are separated by semicolons
    cmo_ad_platforms: results.adPlatforms.map((p) => p.value).join(";"),
    cmo_fit_score: results.fitScore,
    cmo_fit_band: results.fitBand,
    cmo_hot_lead: hotLead ? "true" : "false",
    cmo_agency_review: results.agencyReview ? "yes" : "no",
    cmo_revenue: qualAnswers.revenue,
    cmo_budget: qualAnswers.budget,
    cmo_role: qualAnswers.role,
    cmo_role_other: answers.Q3_other || "",
    cmo_partners: qualAnswers.partners,
    cmo_timeline: qualAnswers.timeline,
    cmo_marketing_optin: marketingOptin ? "yes" : "no",
    cmo_session_requested: sessionRequested ? "yes" : "no",
    cmo_call_opener: results.callOpener || "",
    cmo_answers_summary: answersSummary(answers, results),
    cmo_results_url: resultsUrl,
    cmo_quiz_id: quizId,
    mesm_lead_source: LEAD_SOURCES.cmo_benchmark,
  };
  for (const p of results.pillars) properties[`cmo_score_${p.key}`] = p.score;

  return upsertHubspotContact(email, properties);
}

// Every question + answer, one per line
function answersSummary(answers, results) {
  const benchmark = results.answers.map(
    (a) =>
      `${a.answerId || `${a.questionId}_-`} ${a.symbol} ${a.label}: ${a.answer || "-"}${a.points === null ? "" : ` (${a.points})`}`,
  );
  const qual = QUALIFICATION_QUESTIONS.map((q) => {
    const picked = q.options[answers[q.id]];
    const other =
      q.id === "Q3" && answers.Q3_other ? ` (${answers.Q3_other})` : "";
    return `${q.id} ${q.question} ${picked ? `${picked.label}${other} (${picked.points})` : "-"}`;
  });
  return [
    `H1 Business type: ${businessTypeLabel(answers) || "-"}`,
    `H2 Industry: ${industryLabel(answers) || "-"}`,
    `H3 Biggest pressure: ${pressureLabel(answers) || "-"}`,
    ...benchmark,
    ...qual,
  ].join("\n");
}

// ── Resend ─────────────────────────────────────────────────────────────────

async function sendLeadEmail(
  {
    firstName,
    email,
    company,
    website,
    answers,
    results,
    qualAnswers,
    sessionRequested,
    hotLead,
    resultsUrl,
  },
  contactId,
) {
  if (!resend || !contactTo || !contactFrom) return;

  const { overall, tier, fitScore, fitBand, pillars, priorities } = results;
  const band = hotLead ? "HOTTEST LEAD" : `${fitBand} fit`;
  const industry = industryLabel(answers) || "-";
  const subject = `CMO Benchmark · ${band}: ${company} · ${industry} · ${overall}/100 ${tier.name} · Fit ${fitScore}`;
  const hubspotUrl = await hubspotContactUrl(contactId).catch(() => null);

  const h = (title) =>
    `<h3 style="margin:28px 0 8px;font-size:13px;letter-spacing:.08em;color:#666">${escapeHtml(title)}</h3>`;
  const row = (k, v) =>
    `<tr><td style="padding:2px 12px 2px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:2px 0">${escapeHtml(v)}</td></tr>`;
  // Full question for context, their answer underneath
  const answerLine = (a) =>
    `<li style="margin:0 0 8px">${escapeHtml(a.question)}<br/><strong>${escapeHtml(a.answer || "-")}</strong></li>`;
  const link = (href, text) =>
    `<a href="${escapeHtml(href)}" style="color:#000">${escapeHtml(text)}</a>`;
  const flag = (text, bg) =>
    `<p style="background:${bg};padding:8px 12px;border-radius:6px;margin:0 0 8px"><strong>${escapeHtml(text)}</strong></p>`;

  // Top of the email, in this order
  const flags = [
    hotLead && flag("Hottest lead. Same-day outreach.", "#ffd6d6"),
    sessionRequested && flag("Session requested", "#d6f5dd"),
    results.agencyReview && flag("Agency under review", "#ffe8c2"),
    !results.isDecisionMaker &&
      flag("Not the decision-maker. Ask who signs off.", "#fff3cd"),
    flag(
      `Ad stack: ${results.adPlatforms.map((p) => p.label).join(", ") || "Not answered"}`,
      "#eef2ff",
    ),
  ].filter(Boolean);

  const priorityHtml = priorities.length
    ? priorities
        .map(
          (p, i) => `
        <p style="margin:16px 0 4px"><strong>PRIORITY ${i + 1}: ${escapeHtml(p.label)} · ${p.score}</strong></p>
        <ul style="margin:0;padding-left:18px">${p.lowAnswers
          .map(
            (a) =>
              `${answerLine(a)}${a.read ? `<li style="list-style:none;margin:0 0 8px;color:#555">Read: ${escapeHtml(a.read)}</li>` : ""}`,
          )
          .join("")}</ul>`,
        )
        .join("")
    : `<p>${escapeHtml(NO_PRIORITIES_MESSAGE)}</p>`;

  // Each qualification answer with the fit points it earned
  const FIT_LABELS = {
    revenue: "Annual revenue",
    budget: "Annual marketing budget",
    role: "Role",
    partners: "External partners",
    timeline: "Planning to act",
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

  const roleText =
    qualAnswers.role === "Other" && answers.Q3_other
      ? `Other: ${answers.Q3_other}`
      : qualAnswers.role;

  const allAnswersHtml = [
    group("About them", [
      qa(null, H1.question, businessTypeLabel(answers)),
      qa(null, H2.question, industryLabel(answers)),
      qa(null, H3.question, pressureLabel(answers)),
    ]),
    ...PILLARS.map((p) =>
      group(
        p.label,
        results.answers
          .filter((a) => a.pillar === p.key)
          .map((a) => qa(a.symbol, a.question, a.answer)),
      ),
    ),
    group(
      "Qualification",
      QUALIFICATION_QUESTIONS.map((q) =>
        qa(
          null,
          q.question,
          q.key === "role" ? roleText : q.options[answers[q.id]]?.label,
        ),
      ),
    ),
  ].join("");

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; max-width: 680px;">
      ${flags.join("")}

      ${h("WHO")}
      <table>
        ${row("Name", firstName)}
        ${row("Role", roleText || "-")}
        ${row("Company", company)}
        ${row("Website", website)}
        ${row("Email", email)}
        ${row("Business type", businessTypeLabel(answers) || "-")}
        ${row("Industry", industry)}
        ${row("Biggest pressure", pressureLabel(answers) || "-")}
      </table>

      ${h("FIT")}
      <table>
        ${fitRows.join("")}
        ${row("Fit score", `${fitScore}/100 (${fitBand})`)}
      </table>

      ${h("SCORE")}
      <table>
        ${row("Overall", `${overall}/100 ${tier.name} · Fit ${fitScore} (${fitBand})`)}
        ${pillars.map((p) => row(p.label, `${p.score} · ${pillarStatus(p.score).name}`)).join("")}
      </table>

      ${h("OPEN WITH")}
      <p style="margin:0">${results.callOpener ? `“${escapeHtml(results.callOpener)}”` : "-"}</p>

      ${h("PRIORITIES")}
      ${priorityHtml}

      ${h("NOT SURE ANSWERS")}
      ${
        results.unsure.length
          ? `<ul style="margin:0;padding-left:18px">${results.unsure.map(answerLine).join("")}</ul>`
          : '<p style="margin:0">None</p>'
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

  // Petar (SECOND_CONTACT) only hears about leads who asked for a session
  const result = await resend.emails.send({
    to: [contactTo, sessionRequested && secondContact, debugContact].filter(
      Boolean,
    ),
    from: contactFrom,
    replyTo: email,
    subject,
    html,
  });
  if (result?.error) throw new Error(result.error.message || "Resend error");
}

// The shareable report: score, priorities with the business case, pillar
// scores and the leadership summary
async function sendProspectReport({
  firstName,
  email,
  company,
  answers,
  results,
  shareUrl,
}) {
  if (!resend || !contactFrom) return;

  const { overall, tier, pillars, priorities, working, fitBand } = results;
  const subhead = PRESSURE_HEADLINES[answers.H3]?.(results.term);
  const summary = leadershipSummary(results, {
    company,
    pressure: answers.H3,
  });
  // High and mid fit get the session; the request form sits at the base of
  // their results page. Low fit gets the results page itself, to download.
  const cta =
    fitBand === "Low"
      ? shareUrl && { ...CTA.report, href: shareUrl }
      : {
          ...CTA.session,
          href: shareUrl ? `${shareUrl}#review` : absolute(BOOKING_URL),
        };

  const h3 = (text) =>
    `<h3 style="margin:28px 0 8px">${escapeHtml(text)}</h3>`;

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 600px;">
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Here’s your marketing benchmark.</p>
      <h1 style="margin:16px 0 0;font-weight:400">${overall}/100 · ${escapeHtml(tier.name)}</h1>
      ${subhead ? `<p style="color:#555">${escapeHtml(subhead)}</p>` : ""}
      <p>${escapeHtml(tier.bullets.join(" "))}</p>

      ${h3("Leadership summary")}
      <p style="border-left:3px solid #c1d2fc;padding-left:12px">${escapeHtml(summary)}</p>

      ${h3(
        priorities.length === 0
          ? "Your priorities"
          : priorities.length === 1
            ? "Your top priority"
            : `Your ${priorities.length} priorities`,
      )}
      ${
        priorities.length === 0
          ? `<p>${escapeHtml(NO_PRIORITIES_MESSAGE)}</p>`
          : priorities
              .map(
                (p, i) => `
        <p style="margin:0 0 20px"><strong>${i + 1}. ${escapeHtml(p.headline)}</strong><br/>
        <span style="color:#555">${escapeHtml(p.label)} · ${p.score}/100</span><br/>
        ${p.told.length ? `<strong>You told us:</strong> ${p.told.slice(0, 2).map(escapeHtml).join(" ")}<br/>` : ""}
        <strong>The business case:</strong> ${escapeHtml(p.businessCase)}
        ${p.firstMove ? `<br/><strong>First move:</strong> ${escapeHtml(p.firstMove)}` : ""}</p>`,
              )
              .join("")
      }

      ${h3("All eight pillars")}
      <table>${pillars
        .map(
          (p) =>
            `<tr><td style="padding:4px 16px 4px 0">${escapeHtml(p.label)}</td><td style="padding:4px 16px 4px 0"><strong>${p.score}</strong></td><td style="color:#555">${escapeHtml(pillarStatus(p.score).name)}</td></tr>`,
        )
        .join("")}</table>

      ${
        working
          ? `${h3("What’s working")}<p><strong>${escapeHtml(working.label)}:</strong> ${escapeHtml(working.working)}</p>`
          : ""
      }

      ${
        shareUrl
          ? `<p style="margin-top:24px"><a href="${escapeHtml(shareUrl)}" style="color:#000">View, share or download your report</a><br/>
      <span style="color:#888;font-size:12px">This link works for ${SHARE_LINK_DAYS} days. Anyone you send it to can view it.</span></p>`
          : ""
      }
      ${
        cta
          ? `${h3(cta.headline)}
      ${cta.body.map((b) => `<p>${escapeHtml(b)}</p>`).join("")}
      <p><a href="${escapeHtml(cta.href)}" style="display:inline-block;background:#000;color:#c1d2fc;padding:10px 20px;border-radius:16px;text-decoration:none">${escapeHtml(cta.button)}</a></p>
      ${cta.microcopy ? `<p style="color:#888;font-size:12px">${escapeHtml(cta.microcopy)}</p>` : ""}`
          : ""
      }
      <p style="color:#888;font-size:12px;margin-top:32px">Mesmerise Digital · Confidential · You’re receiving this because you completed the marketing benchmark.</p>
    </div>
  `;

  const result = await resend.emails.send({
    to: [email],
    from: contactFrom,
    subject: `Your marketing benchmark: ${overall}/100 (${tier.name})`,
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
