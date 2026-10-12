"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import SmallTitle from "@/components/ui/SmallTitle";
import {
  TIERS,
  PRESSURE_HEADLINES,
  pillarStatus,
  CTA,
  NO_PRIORITIES_MESSAGE,
} from "@/lib/cmo-benchmark/quizData";
import { tierFor, leadershipSummary } from "@/lib/cmo-benchmark/scoring";
import { TierScale, ShareLink } from "../growth-leak-audit/QuizResults";
import ReviewCta from "../growth-leak-audit/ReviewCta";

// Same as the Growth Leak results: "You're not sure..." + "Sales push back..."
// → "you're not sure..., and sales push back..."
function joinTold(lines) {
  const parts = lines.map(
    (l) => l.charAt(0).toLowerCase() + l.slice(1).replace(/\.$/, ""),
  );
  return `${parts.join(", and ")}.`;
}

const btnOutline =
  "inline-flex items-center justify-center rounded-2xl border border-[var(--mesm-grey)] px-4 py-1.5 text-sm hover:border-[var(--mesm-blue)] hover:text-[var(--mesm-blue)] duration-200";

const printReport = () => window.print();

// results: computeResults() output. pressure: the H3 value.
// firstName, company: from the gate (or the shared link's token).
// share: { url, expires } for the results link, when there is one.
// contact: the gate details, to pre-fill the session request form.
// quizId: links a session request to the quiz's HubSpot contact.
export default function CmoResults({
  results,
  pressure,
  firstName,
  company,
  share,
  contact,
  quizId,
}) {
  const { overall, pillars, priorities, working, fitBand } = results;
  const tier = tierFor(overall);
  const subhead = PRESSURE_HEADLINES[pressure]?.(results.term);
  const summary = leadershipSummary(results, { company, pressure });

  return (
    <div className="flex flex-col gap-32">
      {/* 1. Headline, score and tier ladder */}
      <section className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="page-title-medium">
            {firstName ? `${firstName}, your` : "Your"} marketing function
            scored {overall}/100.
          </h2>
          {subhead && <p className="p2 text-[var(--mesm-l-grey)]">{subhead}</p>}
        </div>
        {share?.url && <ShareLink url={share.url} expires={share.expires} />}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-baseline gap-2">
            <span className="page-title-large tabular-nums">{overall}</span>
            <span className="p2 text-[var(--mesm-l-grey)]">/ 100</span>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-1 text-xl"
            style={{ borderColor: tier.color, color: tier.color }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: tier.color }}
            />
            {tier.name}
          </span>
        </div>
        <TierScale overall={overall} tiers={TIERS} />
      </section>

      {/* 2. Priorities: pillars under 60, lowest first, max 3 */}
      <section>
        <SmallTitle>
          {priorities.length === 0
            ? "Your priorities"
            : priorities.length === 1
              ? "Your top priority"
              : `Your ${priorities.length} priorities`}
        </SmallTitle>
        <div className="flex flex-col gap-[var(--global-margin-xs)] mt-6">
          {priorities.length === 0 && (
            <p className="p2 text-[var(--mesm-l-grey)]">
              {NO_PRIORITIES_MESSAGE}
            </p>
          )}
          {priorities.map((p, i) => (
            <article
              key={p.key}
              className="flex flex-col gap-4 rounded-lg border border-[var(--mesm-grey-dk)] bg-[var(--mesm-grey-xd)] hover:border-[var(--mesm-grey)] duration-200 p-6 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: pillarStatus(p.score).color }}
                />
                <h6 className="text-[var(--mesm-l-grey)] tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {p.label} · {p.score}/100
                </h6>
              </div>
              <h4 className="!mb-0">{p.headline}</h4>
              <div className="flex flex-col gap-3 text-base leading-snug text-[var(--mesm-l-grey)]">
                {p.told?.length > 0 && (
                  <p>
                    <span className="text-[var(--foreground)]">
                      You told us:
                    </span>{" "}
                    {joinTold(p.told.slice(0, 2))}
                  </p>
                )}
                <p>
                  <span className="text-[var(--foreground)]">
                    The business case:
                  </span>{" "}
                  {p.businessCase}
                </p>
                {p.firstMove && (
                  <p>
                    <span className="text-[var(--foreground)]">
                      First move:
                    </span>{" "}
                    {p.firstMove}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Pillar breakdown */}
      <section>
        <SmallTitle>Pillar breakdown</SmallTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--global-margin-xs)] mt-6">
          {pillars.map((p, i) => {
            const status = pillarStatus(p.score);
            return (
              <motion.article
                key={p.key}
                className="flex flex-col justify-between gap-8 rounded-lg border border-[var(--mesm-grey-dk)] bg-black/20 hover:bg-[var(--foreground)]/5 transition-colors p-5 md:p-6 min-h-[150px] md:min-h-[180px]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 * i }}
              >
                <p className="text-base leading-snug text-[var(--mesm-l-grey)]">
                  {p.label}
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="flex items-baseline gap-1">
                      <span className="page-title-small tabular-nums">
                        {p.score}
                      </span>
                      <span className="text-sm text-[var(--mesm-l-grey)]">
                        /100
                      </span>
                    </span>
                    <span className="text-sm" style={{ color: status.color }}>
                      {status.name}
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-[var(--mesm-grey-dk)]">
                    <motion.div
                      className="h-full"
                      style={{ background: status.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(p.score, 2)}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + 0.06 * i,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 4. What's working: their top pillar, skipped when nothing scores 60+ */}
      {working && (
        <section>
          <SmallTitle>What&apos;s working</SmallTitle>
          <article className="flex flex-col gap-4 rounded-lg border border-[var(--mesm-grey-dk)] bg-[var(--mesm-grey-xd)] p-6 md:p-7 mt-6">
            <h4 className="text-[var(--mesm-l-grey)] tabular-nums">
              {working.label}
            </h4>

            <h4 className="text-[var(--mesm-l-grey)] tabular-nums">
              {working.score}/100
            </h4>
          </article>
        </section>
      )}

      {/* 5. Leadership summary: the shareable piece */}
      <section>
        <SmallTitle>Leadership summary</SmallTitle>
        <div className="flex flex-col gap-6 rounded-lg border border-[var(--mesm-blue)]/40 p-6 md:p-8 mt-6">
          <p className="p2 leading-snug">{summary}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={printReport} className={btnOutline}>
              Download PDF
            </button>
          </div>
        </div>
      </section>

      {/* 6. CTA by fit band: high and mid get the session, low the report */}
      {fitBand !== "Low" ? (
        <ReviewCta
          contact={contact}
          resultsUrl={share?.url}
          quizId={quizId}
          copy={CTA.session}
          endpoint="/api/cmo-benchmark/session"
          event="cmo_benchmark_session_request"
        />
      ) : (
        <ReportCta />
      )}

      <PrintReport
        results={results}
        company={company}
        subhead={subhead}
        summary={summary}
      />
    </div>
  );
}

// Low-fit CTA: photo left, text right, with the report download
function ReportCta() {
  const copy = CTA.report;
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-start">
      <figure className="!m-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={CTA.session.image}
            alt={CTA.session.caption}
            fill
            sizes="(min-width: 768px) 420px, 90vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-6 text-xs tracking-wide text-[var(--foreground)]/80">
          {CTA.session.caption}
        </figcaption>
      </figure>
      <div className="flex flex-col gap-6">
        <h5 className="uppercase">{copy.eyebrow}</h5>
        <h2>{copy.headline}</h2>
        {copy.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <button
          type="button"
          onClick={printReport}
          className="w-fit mt-6 inline-flex items-center justify-center select-none border whitespace-nowrap duration-150 ease-out rounded-2xl hover:rounded-xl text-xl leading-tight px-4 py-2 bg-[var(--accent2)]/98 border-[var(--accent2)] text-[var(--background)]/98 hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)] hover:text-[var(--mesm-l-grey)]"
        >
          {copy.button}
        </button>
      </div>
    </section>
  );
}

// Light, print-only copy of the report, rendered straight into <body> so the
// print stylesheet can hide the rest of the site. "Download PDF" opens the
// browser's print dialog, where it saves as a PDF. Inline styles keep the
// site's global type styles out of it.
const PRINT_CSS = `
#cmo-print { display: none; }
@media print {
  body > *:not(#cmo-print) { display: none !important; }
  body { background: #fff !important; }
  #cmo-print { display: block; }
  @page { margin: 16mm; }
}`;

const ink = "#111";
const muted = "#666";
const rule = "1px solid #ddd";
const h = {
  fontSize: 11,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: muted,
  margin: "28px 0 10px",
};

function PrintReport({ results, company, subhead, summary }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const { overall, tier, pillars, priorities, working } = results;
  const date = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return createPortal(
    <div
      id="cmo-print"
      style={{
        color: ink,
        background: "#fff",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <style>{PRINT_CSS}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: rule,
          paddingBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          Mesmerise · Marketing benchmark
        </div>
        <div style={{ fontSize: 12, color: muted }}>
          {company ? `${company} · ` : ""}
          {date}
        </div>
      </div>

      <div style={{ fontSize: 40, fontWeight: 300, margin: "24px 0 4px" }}>
        {overall}/100 · {tier.name}
      </div>
      {subhead && <div style={{ fontSize: 15, color: muted }}>{subhead}</div>}

      <div style={h}>Leadership summary</div>
      <div style={{ fontSize: 15 }}>{summary}</div>

      <div style={h}>Priorities</div>
      {priorities.length === 0 && <div>{NO_PRIORITIES_MESSAGE}</div>}
      {priorities.map((p, i) => (
        <div key={p.key} style={{ margin: "0 0 14px", breakInside: "avoid" }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {i + 1}. {p.headline}
          </div>
          <div style={{ color: muted, fontSize: 12 }}>
            {p.label} · {p.score}/100
          </div>
          {p.told?.length > 0 && (
            <div>
              <strong>You told us:</strong> {joinTold(p.told.slice(0, 2))}
            </div>
          )}
          <div>
            <strong>The business case:</strong> {p.businessCase}
          </div>
          {p.firstMove && (
            <div>
              <strong>First move:</strong> {p.firstMove}
            </div>
          )}
        </div>
      ))}

      <div style={h}>Pillar scores</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {pillars.map((p) => (
            <tr key={p.key} style={{ borderBottom: rule }}>
              <td style={{ padding: "6px 0" }}>{p.label}</td>
              <td style={{ padding: "6px 0", textAlign: "right", width: 70 }}>
                <strong>{p.score}</strong>/100
              </td>
              <td
                style={{ padding: "6px 0 6px 16px", color: muted, width: 100 }}
              >
                {pillarStatus(p.score).name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {working && (
        <>
          <div style={h}>What&apos;s working</div>
          <div>
            <strong>{working.label}:</strong> {working.working}
          </div>
        </>
      )}

      <div
        style={{
          marginTop: 32,
          paddingTop: 12,
          borderTop: rule,
          fontSize: 11,
          color: muted,
        }}
      >
        Confidential · Prepared by Mesmerise Digital · mesmeriseco.com
      </div>
    </div>,
    document.body,
  );
}
