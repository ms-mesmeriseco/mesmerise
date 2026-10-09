"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import SmallTitle from "@/components/ui/SmallTitle";
import {
  GOAL_HEADLINES,
  TIERS,
  tierRange,
  pillarStatus,
  CTA,
  GUIDE_URL,
  SHARE_LINK_DAYS,
} from "@/lib/quiz/quizData";
import { tierFor, NO_LEAKS_MESSAGE } from "@/lib/quiz/scoring";
import ReviewCta from "./ReviewCta";

// Top of the scale is the lowest tier; the marker travels down towards Category of One
const SCALE = TIERS;
const EASE = [0.22, 1, 0.36, 1];
const EQUAL_BANDS = SCALE.map((_, i) => ({
  top: (100 / SCALE.length) * i,
  height: 100 / SCALE.length,
}));

// Look tiers up by name, never by object identity: results held in state can
// outlive a module reload and carry stale tier objects.
const scaleIndex = (tier) => SCALE.findIndex((t) => t.name === tier.name);

// Vertical position (0 = top, 100 = bottom) of a score on the scale, inside
// its tier's row so the marker lines up with the card
function scalePosition(score, bands) {
  const tier = tierFor(score);
  const band = bands[scaleIndex(tier)];
  const i = TIERS.indexOf(tier);
  const max = i < TIERS.length - 1 ? TIERS[i + 1].min : 101;
  const within = (score - tier.min) / (max - tier.min); // 0 at the top of the band
  return band.top + within * band.height * 0.6 + band.height * 0.2;
}

// "You're not sure..." + "Prospects push back..." → "you're not sure..., and prospects push back..."
function joinTold(lines) {
  const parts = lines.map(
    (l) => l.charAt(0).toLowerCase() + l.slice(1).replace(/\.$/, ""),
  );
  return `${parts.join(", and ")}.`;
}

function TierScale({ overall }) {
  const tier = tierFor(overall);
  const row = scaleIndex(tier);
  const next = SCALE[row + 1] || null;

  // Rows have different heights (only the current tier is expanded), so the
  // track is laid out from each card's measured position
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const [bands, setBands] = useState(EQUAL_BANDS);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const total = grid.offsetHeight;
      if (!total) return;
      setBands(
        rowRefs.current.map((el) => ({
          top: (el.offsetTop / total) * 100,
          height: (el.offsetHeight / total) * 100,
        })),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const center = (i) => bands[i].top + bands[i].height / 2;
  const gradient = `linear-gradient(to bottom, ${SCALE.map((t, i) => `${t.color} ${center(i)}%`).join(", ")})`;
  const markerTop = scalePosition(overall, bands);
  const targetTop = next ? center(row + 1) : null;

  return (
    <div
      ref={gridRef}
      className="relative grid grid-cols-[10px_1fr] md:grid-cols-[180px_10px_1fr] gap-x-8 md:gap-x-10 gap-y-[var(--global-margin-xs)]"
    >
      {/* Scale: faded track, filled from the top down to the marker */}
      <div className="absolute top-0 bottom-0 left-0 md:left-[220px] w-[10px] pointer-events-none">
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ background: gradient }}
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
              background: gradient,
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

      {SCALE.map((t, i) => {
        const isCurrent = t.name === tier.name;
        const isNext = next && t.name === next.name;
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
            {/* Only the current tier is expanded; the rest are name + range */}
            <div
              ref={(el) => (rowRefs.current[i] = el)}
              className={[
                "flex flex-col gap-3 rounded-md border-1 duration-300",
                isCurrent
                  ? "bg-[var(--mesm-grey-xd)] p-6 md:p-7"
                  : "bg-black/20 border-[var(--mesm-grey-dk)] px-6 py-4 md:px-7",
              ].join(" ")}
              style={isCurrent ? { borderColor: t.color } : undefined}
            >
              <div className="flex items-center justify-between gap-4">
                <h6
                  className="text-[var(--mesm-l-grey)] tabular-nums"
                  style={{ opacity: isCurrent ? 1 : 0.5 }}
                >
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
                {isNext && (
                  <span className="text-xs leading-none rounded-2xl px-3 py-1.5 border border-dashed border-[var(--mesm-l-grey)] whitespace-nowrap tabular-nums">
                    Next tier: {t.min}
                  </span>
                )}
              </div>
              {isCurrent && (
                <ul className="flex flex-col gap-1 !m-0">
                  {t.bullets.map((b) => (
                    <li key={b} className="text-base leading-snug">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// "29 days, 23 hrs" / "5 hrs, 12 mins" / "12 mins"
function timeLeft(ms) {
  const mins = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(mins / 1440);
  const hrs = Math.floor((mins % 1440) / 60);
  const unit = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (days > 0) return `${unit(days, "day")}, ${unit(hrs, "hr")}`;
  if (hrs > 0) return `${unit(hrs, "hr")}, ${unit(mins % 60, "min")}`;
  return unit(mins, "min");
}

// Copy button plus a live countdown to when the results link stops working.
// The countdown starts after mount so server and client render the same.
export function ShareLink({ url, expires }) {
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your results link:", url);
    }
  }

  const remaining = expires && now ? expires - now : null;
  const expiresOn =
    expires &&
    new Date(expires).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
    });

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={copy}
        className="text-sm rounded-2xl border border-[var(--mesm-grey)] px-4 py-1.5 hover:border-[var(--mesm-blue)] hover:text-[var(--mesm-blue)] duration-200"
      >
        {copied ? "Link copied" : "Copy share link"}
      </button>
      {remaining !== null ? (
        <span className="inline-flex items-center gap-2 text-sm text-[var(--mesm-l-grey)] tabular-nums">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                remaining < 3 * 86400000
                  ? "var(--mesm-red)"
                  : "var(--mesm-yellow)",
            }}
          />
          Link expires in{" "}
          <span className="text-[var(--foreground)]">
            {timeLeft(remaining)}
          </span>{" "}
          ({expiresOn})
        </span>
      ) : (
        <span className="text-sm text-[var(--mesm-l-grey)]">
          Anyone with the link can view these results for {SHARE_LINK_DAYS}{" "}
          days.
        </span>
      )}
    </div>
  );
}

// share: { url, expires } for the results link, when there is one.
// contact: the gate details, to pre-fill the review request form.
export default function QuizResults({ results, goal, share, contact }) {
  const { overall, pillars, leaks, fitBand } = results;
  const tier = tierFor(overall);
  const headline = GOAL_HEADLINES[goal];

  return (
    <div className="flex flex-col gap-32">
      {/* Overall score and tier */}
      <section className="flex flex-col gap-12">
        {headline && <h2 className="page-title-medium">{headline}</h2>}
        {share?.url && <ShareLink url={share.url} expires={share.expires} />}
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

      {/* Leaks (pillars under 60, max 3): what they told us, why it matters, what to do first */}
      <section>
        <SmallTitle>
          {leaks.length === 0
            ? "Your leaks"
            : leaks.length === 1
              ? "Your biggest leak"
              : `Your top ${leaks.length} leaks`}
        </SmallTitle>
        <div className="flex flex-col gap-[var(--global-margin-xs)] mt-6">
          {leaks.length === 0 && (
            <p className="p2 text-[var(--mesm-l-grey)]">{NO_LEAKS_MESSAGE}</p>
          )}
          {leaks.map((leak, i) => (
            <article
              key={leak.key}
              className="flex flex-col gap-4 rounded-lg border border-[var(--mesm-grey-dk)] bg-[var(--mesm-grey-xd)] hover:border-[var(--mesm-grey)] duration-200 p-6 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: pillarStatus(leak.score).color }}
                />
                <h6 className="text-[var(--mesm-l-grey)] tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {leak.label} · {leak.score}
                  /100
                </h6>
              </div>
              <h4 className="!mb-0">{leak.headline}</h4>
              <div className="flex flex-col gap-3 text-base leading-snug text-[var(--mesm-l-grey)]">
                {leak.told?.length > 0 && (
                  <p>
                    <span className="text-[var(--foreground)]">
                      You told us:
                    </span>{" "}
                    {joinTold(leak.told.slice(0, 2))}
                  </p>
                )}
                <p>
                  <span className="text-[var(--foreground)]">
                    Why it matters:
                  </span>{" "}
                  {leak.why || leak.cost}
                </p>
                <p>
                  <span className="text-[var(--foreground)]">First fix:</span>{" "}
                  {leak.firstFix}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pillar breakdown */}
      <section>
        <SmallTitle>Pillar breakdown</SmallTitle>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[var(--global-margin-xs)] mt-6">
          {pillars.map((p, i) => {
            const status = pillarStatus(p.score);
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
                  <div className="flex items-baseline justify-between gap-3">
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

      {/* CTA by fit band: low fit gets the guide, everyone else the review */}
      {fitBand !== "Low" ? (
        <ReviewCta contact={contact} resultsUrl={share?.url} />
      ) : (
        <section className="w-full bg-[var(--mesm-grey)]/20 border border-[var(--mesm-grey)]/20 py-12 md:py-16 px-6 md:px-12 rounded-2xl flex flex-col items-center text-center gap-6">
          <div className="flex items-center justify-center w-14 h-14 p-2 rounded-full bg-[var(--mesm-red)]">
            <Image
              src="/logoMark-SVG_mesm.svg"
              alt="Mesmerise Digital"
              width={36}
              height={36}
            />
          </div>
          <h2 className="text-2xl md:text-3xl">{CTA.resource.headline}</h2>
          {CTA.resource.body.map((p) => (
            <p key={p} className="max-w-xl text-[var(--mesm-l-grey)]">
              {p}
            </p>
          ))}
          <Button href={GUIDE_URL} size="large" extraClass="mt-2">
            {CTA.resource.button}
          </Button>
        </section>
      )}
    </div>
  );
}
