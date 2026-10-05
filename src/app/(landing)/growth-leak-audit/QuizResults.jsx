"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import SmallTitle from "@/components/ui/SmallTitle";
import {
  GOAL_HEADLINES,
  TIERS,
  tierRange,
  CTA,
  BOOKING_URL,
  GUIDE_URL,
} from "@/lib/quiz/quizData";
import { tierFor } from "@/lib/quiz/scoring";

// Top of the scale is the lowest tier; the marker travels down towards Category of One
const SCALE = TIERS;
const GRADIENT = `linear-gradient(to bottom, ${SCALE.map((t) => t.color).join(", ")})`;
const EASE = [0.22, 1, 0.36, 1];

// Look tiers up by name, never by object identity: results held in state can
// outlive a module reload and carry stale tier objects.
const scaleIndex = (tier) => SCALE.findIndex((t) => t.name === tier.name);

// Vertical position (0 = top, 100 = bottom) of a score on the scale.
// Each tier gets an equal row so the marker lines up with its card.
function scalePosition(score) {
  const tier = tierFor(score);
  const row = scaleIndex(tier);
  const i = TIERS.indexOf(tier);
  const max = i < TIERS.length - 1 ? TIERS[i + 1].min : 101;
  const within = (score - tier.min) / (max - tier.min); // 0 at the top of the band
  const rowHeight = 100 / SCALE.length;
  return row * rowHeight + within * rowHeight * 0.6 + rowHeight * 0.2;
}

function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) || [text];
}

function TierScale({ overall }) {
  const tier = tierFor(overall);
  const markerTop = scalePosition(overall);
  const row = scaleIndex(tier);
  const next = SCALE[row + 1] || null;
  const targetTop = next ? (100 / SCALE.length) * (row + 1.5) : null;

  return (
    <div className="relative grid grid-cols-[10px_1fr] md:grid-cols-[180px_10px_1fr] gap-x-8 md:gap-x-10 gap-y-[var(--global-margin-xs)] auto-rows-fr">
      {/* Scale: faded track, filled from the top down to the marker */}
      <div className="absolute top-0 bottom-0 left-0 md:left-[220px] w-[10px] pointer-events-none">
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ background: GRADIENT }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 rounded-full overflow-hidden"
          style={{ top: 0 }}
          initial={{ height: "0%" }}
          animate={{ height: `${markerTop}%` }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {/* Gradient sized to the full track so colours stay put as it fills */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              background: GRADIENT,
              height: `${(100 / markerTop) * 100}%`,
            }}
          />
        </motion.div>

        {next && (
          <>
            <motion.div
              className="absolute left-1/2 border-l border-dashed border-[var(--mesm-l-grey)]/60"
              style={{
                top: `${markerTop}%`,
                height: `${targetTop - markerTop}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            />
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-dashed border-[var(--mesm-l-grey)] bg-[var(--background)]"
              style={{ top: `${targetTop}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            />
          </>
        )}

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 bg-[var(--background)] flex items-center justify-center"
          style={{ borderColor: tier.color }}
          initial={{ top: "0%" }}
          animate={{ top: `${markerTop}%` }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <span className="text-sm tabular-nums">{overall}</span>
        </motion.div>
      </div>

      {SCALE.map((t) => {
        const isCurrent = t.name === tier.name;
        return (
          <div key={t.name} className="contents">
            <div
              className="hidden md:flex items-center duration-300"
              style={{ opacity: isCurrent ? 1 : 0.45 }}
            >
              <span className="text-2xl" style={{ color: t.color }}>
                {t.name}
              </span>
            </div>
            <div />
            <div
              className={[
                "flex flex-col gap-3 rounded-md border-1 p-6 md:p-7 duration-300",
                isCurrent
                  ? "bg-[var(--mesm-grey-xd)]"
                  : "bg-black/20 border-[var(--mesm-grey-dk)] opacity-50",
              ].join(" ")}
              style={isCurrent ? { borderColor: t.color } : undefined}
            >
              <div className="flex items-center justify-between gap-4">
                <h6 className="text-[var(--mesm-l-grey)] tabular-nums">
                  <span className="md:hidden mr-2" style={{ color: t.color }}>
                    {t.name} ·
                  </span>
                  {tierRange(t)}
                </h6>
                {isCurrent && (
                  <span
                    className="text-xs leading-none rounded-2xl px-3 py-1.5 text-[var(--background)] whitespace-nowrap"
                    style={{ background: t.color }}
                  >
                    You are here
                  </span>
                )}
              </div>
              <ul className="flex flex-col gap-1 !m-0">
                {splitSentences(t.copy).map((s) => (
                  <li key={s} className="text-base leading-snug">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function QuizResults({ results, goal }) {
  const { overall, pillars, leaks, fitBand } = results;
  const tier = tierFor(overall);
  const cta = fitBand === "Low" ? CTA.resource : CTA.call;
  const ctaHref = fitBand === "Low" ? GUIDE_URL : BOOKING_URL;
  const headline = GOAL_HEADLINES[goal];

  return (
    <div className="flex flex-col gap-32">
      {/* Overall score and tier */}
      <section className="flex flex-col gap-12">
        {headline && <h2 className="page-title-medium">{headline}</h2>}
        <div>
          <h3>Overall score:</h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
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
        </div>
        <TierScale overall={overall} />
      </section>

      {/* Pillar breakdown */}
      <section>
        <SmallTitle>Pillar breakdown</SmallTitle>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[var(--global-margin-xs)] mt-6">
          {pillars.map((p, i) => {
            const color = tierFor(p.score).color;
            return (
              <motion.article
                key={p.key}
                className="flex flex-col justify-between gap-8 rounded-lg border border-[var(--mesm-grey-dk)] bg-black/20 hover:bg-[var(--foreground)]/5 transition-colors p-5 md:p-7 min-h-[150px] md:min-h-[180px]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 * i }}
              >
                <p className="text-base text-[var(--mesm-l-grey)]">{p.label}</p>
                <div className="flex flex-col gap-4">
                  <span className="page-title-small tabular-nums">
                    {p.score}
                  </span>
                  <div className="h-[2px] w-full bg-[var(--mesm-grey-dk)]">
                    <motion.div
                      className="h-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(p.score, 2)}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + 0.08 * i,
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

      {/* Top 3 leaks */}
      <section>
        <SmallTitle>Your top 3 leaks</SmallTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--global-margin-xs)] mt-6">
          {leaks.map((leak, i) => (
            <article
              key={leak.key}
              className="flex flex-col gap-4 rounded-lg border border-[var(--mesm-grey-dk)] bg-[var(--mesm-grey-xd)] hover:border-[var(--mesm-grey)] duration-200 p-6 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: tierFor(leak.score).color }}
                />
                <h6 className="text-[var(--mesm-l-grey)]">
                  {String(i + 1).padStart(2, "0")} · {leak.label}
                </h6>
              </div>
              <h4 className="!mb-0">{leak.headline}</h4>
              <p className="text-base leading-snug text-[var(--mesm-l-grey)]">
                {leak.cost}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA by fit band, styled like CtaBentoBox */}
      <section className="w-full bg-[var(--mesm-grey)]/20 border border-[var(--mesm-grey)]/20 py-12 md:py-16 px-6 md:px-12 rounded-2xl flex flex-col items-center text-center gap-6">
        <div className="flex items-center justify-center w-14 h-14 p-2 rounded-full bg-[var(--mesm-red)]">
          <Image
            src="/logoMark-SVG_mesm.svg"
            alt="Mesmerise Digital"
            width={36}
            height={36}
          />
        </div>
        <h2 className="text-2xl md:text-3xl">{cta.headline}</h2>
        <p className="max-w-xl text-[var(--mesm-l-grey)]">{cta.body}</p>
        <Button href={ctaHref} size="large" extraClass="mt-2">
          {cta.button}
        </Button>
      </section>
    </div>
  );
}
