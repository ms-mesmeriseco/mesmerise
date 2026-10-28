"use client";

import { useRef, useState } from "react";
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
import { TierScale } from "../growth-leak-audit/QuizResults";
import ReviewCta from "../growth-leak-audit/ReviewCta";
import ReportPdf, { exportReportPdf } from "./ReportPdf";

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

// "Get Instant Access" sizing (CROForm), filled white as the primary action
const btnSolid =
  "w-full rounded-2xl border-1 border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] py-2 font-normal cursor-pointer hover:opacity-85 duration-200";

// "Acme Pty Ltd" → "acme-pty-ltd-marketing-benchmark.pdf"
const pdfName = (company) =>
  `${[company, "marketing benchmark"]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.pdf`;

// Builds the PDF from the off-screen report. Returns [export, exporting, error].
function usePdfExport(reportRef, company) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  async function run() {
    if (exporting || !reportRef.current) return;
    setExporting(true);
    setError(null);
    try {
      await exportReportPdf(reportRef.current, pdfName(company));
      window.dataLayer?.push({ event: "cmo_benchmark_pdf_export" });
    } catch (err) {
      console.error("PDF export failed:", err);
      setError("Sorry, the PDF couldn't be created. Please try again.");
    } finally {
      setExporting(false);
    }
  }
  return [run, exporting, error];
}

// results: computeResults() output. pressure: the H3 value.
// firstName, company: from the gate (or the shared link's token).
// share: { url } for the results link, sent with a session request so the
// team can open their results.
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
  const reportRef = useRef(null);
  const [exportPdf, exporting, exportError] = usePdfExport(reportRef, company);
  const exportStatus = exportError && (
    <span role="status" className="text-sm text-red-600">
      {exportError}
    </span>
  );
  const exportButton = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={exportPdf}
        disabled={exporting}
        className={`${btnOutline} disabled:opacity-50 disabled:cursor-wait`}
      >
        {exporting ? "Creating PDF..." : "Export as PDF"}
      </button>
      {exportStatus}
    </div>
  );

  return (
    <div className="flex flex-col gap-32">
      {/* 1. Headline, score and tier ladder */}
      <section className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="page-title-medium">
            {firstName ? `${firstName}, your` : "Your"} marketing scored{" "}
            {overall}/100.
          </h2>
          {subhead && <p className="p2 text-[var(--mesm-l-grey)]">{subhead}</p>}
        </div>
        {exportButton}
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
                {p.why && (
                  <p>
                    <span className="text-[var(--foreground)]">
                      Why it matters:
                    </span>{" "}
                    {p.why}
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
            <p className="text-base leading-snug text-[var(--mesm-l-grey)]">
              {working.working}
            </p>
          </article>
        </section>
      )}

      {/* 5. Summary: the shareable piece */}
      <section>
        <SmallTitle>Your summary</SmallTitle>
        <div className="flex flex-col gap-6 rounded-lg border border-[var(--mesm-blue)]/40 p-6 md:p-8 mt-6">
          <p className="p2 leading-snug">{summary}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={exportPdf}
              disabled={exporting}
              className={`${btnSolid} disabled:opacity-50 disabled:cursor-wait`}
            >
              <span className="p2">
                {exporting ? "Creating PDF..." : "Download summary (PDF)"}
              </span>
            </button>
            {exportStatus}
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
        <ReportCta onExport={exportPdf} exporting={exporting} />
      )}

      {/* The PDF's pages, laid out off-screen for the export to capture */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-[-20000px] pointer-events-none"
      >
        <ReportPdf
          ref={reportRef}
          results={results}
          company={company}
          firstName={firstName}
          subhead={subhead}
          summary={summary}
          date={new Date().toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
      </div>
    </div>
  );
}

// Low-fit CTA: photo left, text right, with the PDF export
function ReportCta({ onExport, exporting }) {
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
          onClick={onExport}
          disabled={exporting}
          className="w-fit mt-6 disabled:opacity-50 disabled:cursor-wait inline-flex items-center justify-center select-none border whitespace-nowrap duration-150 ease-out rounded-2xl hover:rounded-xl text-xl leading-tight px-4 py-2 bg-[var(--accent2)]/98 border-[var(--accent2)] text-[var(--background)]/98 hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)] hover:text-[var(--mesm-l-grey)]"
        >
          {exporting ? "Creating PDF..." : copy.button}
        </button>
      </div>
    </section>
  );
}
