"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  pillarsFor,
  H1,
  h2For,
  industriesFor,
  H3,
  questionsFor,
  QUALIFICATION_INTRO,
  QUALIFICATION_QUESTIONS,
  GATE,
  OTHER_MAX_LENGTH,
  isWorkEmail,
} from "@/lib/cmo-benchmark/quizData";
import { computeResults } from "@/lib/cmo-benchmark/scoring";
import { saveProgress, clearProgress } from "./progress";
import CmoResults from "./CmoResults";
import Button from "@/components/ui/Button";

// 3 hook + 25 benchmark + 5 qualification
const TOTAL_QUESTIONS = 33;
const ADVANCE_DELAY = 280;

const HOOK_SECTION = "Getting started";
const QUAL_SECTION = "Last step: benchmarking";

// Hook answers are stored by value, everything else by option index
const isHook = (q) => q.id.startsWith("H");

// A section marker on every screen in place of a bare count
function buildSteps(track) {
  const pillars = pillarsFor(track);
  const question = (q, section) => ({ type: "question", q, section });
  return [
    question(H1, HOOK_SECTION),
    question(h2For(track), HOOK_SECTION),
    question(H3, HOOK_SECTION),
    ...questionsFor(track).map((q) => {
      const i = pillars.findIndex((p) => p.key === q.pillar);
      return question(
        q,
        `Section ${i + 1} of ${pillars.length}: ${pillars[i].label}`,
      );
    }),
    { type: "transition", section: QUAL_SECTION },
    ...QUALIFICATION_QUESTIONS.map((q) => question(q, QUAL_SECTION)),
    { type: "gate" },
    { type: "results" },
  ];
}

const GATE_INDEX = buildSteps().findIndex((s) => s.type === "gate");

// Mirrors <Button variant="primary" size="large"> (which renders a link, not a button)
const btnPrimary = [
  "inline-flex items-center justify-center select-none border whitespace-nowrap",
  "duration-150 ease-out rounded-2xl hover:rounded-xl text-xl leading-tight px-4 py-2",
  "bg-[var(--mesm-blue)] border-[var(--mesm-blue)] text-[var(--background)]",
  "hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)] hover:text-[var(--mesm-l-grey)]",
  "disabled:opacity-40 disabled:cursor-not-allowed",
].join(" ");

const inputClass =
  "w-full border-b-1 border-[var(--mesm-grey-dk)] focus:border-[var(--mesm-blue)] p-[var(--global-margin-sm)] bg-transparent duration-200";

const GATE_FIELDS = [
  { key: "firstName", label: "First name", type: "text", auto: "given-name" },
  { key: "email", label: "Work email", type: "email", auto: "email" },
  { key: "company", label: "Company", type: "text", auto: "organization" },
  { key: "website", label: "Website URL", type: "url", auto: "url" },
];

// initial: saved { stepIndex, answers } to resume from.
// onExit: called when Back is pressed on the first question.
export default function CmoQuiz({ initial, onExit } = {}) {
  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(Math.max(initial?.stepIndex ?? 0, 0), GATE_INDEX),
  );
  const [answers, setAnswers] = useState(initial?.answers ?? {});
  const [contact, setContact] = useState({
    firstName: "",
    email: "",
    company: "",
    website: "",
    marketingOptin: false,
    sessionRequested: false,
  });
  const [hp, setHp] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [share, setShare] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const advanceTimer = useRef(null);
  const topRef = useRef(null);

  const track = answers.H1;
  const steps = useMemo(() => buildSteps(track), [track]);
  const step = steps[stepIndex];

  // Save as they go; cleared once the benchmark is submitted
  useEffect(() => {
    if (step.type !== "results") saveProgress(stepIndex, answers);
  }, [stepIndex, answers, step.type]);

  const questionNumber = steps
    .slice(0, stepIndex + 1)
    .filter((s) => s.type === "question").length;
  const progress =
    step.type === "results" || step.type === "gate"
      ? 1
      : Math.max(
          0,
          (questionNumber - (step.type === "question" ? 1 : 0)) /
            TOTAL_QUESTIONS,
        );

  function go(delta) {
    clearTimeout(advanceTimer.current);
    setStepIndex((i) => Math.min(Math.max(i + delta, 0), steps.length - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectSingle(q, option, index) {
    const value = isHook(q) ? option.value : index;
    setAnswers((a) => {
      const next = { ...a, [q.id]: value };
      // The industry list changes with H1, so drop an industry that isn't on the new list
      if (q.id === "H1" && a.H2 && !industriesFor(value).includes(a.H2)) {
        delete next.H2;
        delete next.H2_other;
      }
      return next;
    });
    clearTimeout(advanceTimer.current);
    // "Other" waits for the optional text field and Continue
    if (option.other) return;
    advanceTimer.current = setTimeout(() => {
      setStepIndex((i) => i + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, ADVANCE_DELAY);
  }

  function toggleMulti(q, index) {
    const exclusive = (i) => q.options[i]?.exclusive;
    setAnswers((a) => {
      const current = a[q.id] || [];
      let next;
      if (current.includes(index)) next = current.filter((i) => i !== index);
      else if (exclusive(index)) next = [index];
      else next = [...current.filter((i) => !exclusive(i)), index];
      return { ...a, [q.id]: next };
    });
  }

  function setOther(q, text) {
    setAnswers((a) => ({ ...a, [`${q.id}_other`]: text }));
  }

  async function submitGate(e) {
    e.preventDefault();
    setError(null);
    if (hp) return;

    const { firstName, email, company, website } = contact;
    if (
      !firstName.trim() ||
      !email.trim() ||
      !company.trim() ||
      !website.trim()
    ) {
      setError("Please fill in all four fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isWorkEmail(email.trim())) {
      setError("Please use your work email.");
      return;
    }
    if (!/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(website.trim())) {
      setError("Please enter a valid website URL.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/cmo-benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, contact, hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );

      const computed = computeResults(answers);
      setResults(computed);
      setQuizId(data.quizId || null);
      setShare(
        data.shareUrl
          ? { url: data.shareUrl, expires: data.shareExpires }
          : null,
      );
      clearProgress();

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "cmo_benchmark_complete",
          cmo_business_type: track,
          cmo_score_overall: computed.overall,
          cmo_tier: computed.tier.name,
          cmo_fit_band: computed.fitBand,
        });
        window.fbq?.("track", "Lead", { content_name: "CMO Benchmark" });
      }
      go(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={topRef}
      className={`w-full mx-auto scroll-mt-24 min-h-[80vh] ${step.type === "results" ? "max-w-4xl" : "max-w-3xl"}`}
    >
      {step.type !== "results" && (
        <div className="mb-12">
          <div className="flex justify-between items-center gap-6 mb-2">
            <button
              type="button"
              onClick={() => (stepIndex === 0 && onExit ? onExit() : go(-1))}
              className="shrink-0 text-sm text-[var(--mesm-l-grey)] hover:text-[var(--foreground)] duration-200"
            >
              &lt;&lt; &nbsp;previous
            </button>
            {step.section && (
              <h6 className="text-right text-[var(--mesm-l-grey)]">
                {step.section}
              </h6>
            )}
          </div>
          <div
            className="h-[2px] w-full bg-[var(--mesm-grey-dk)] overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full bg-[var(--mesm-blue)]"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step.type === "question" ? step.q.id : step.type}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {step.type === "question" && (
            <QuestionScreen
              q={step.q}
              answer={answers[step.q.id]}
              otherText={answers[`${step.q.id}_other`] || ""}
              onSelect={selectSingle}
              onToggle={toggleMulti}
              onOther={setOther}
              onContinue={() => go(1)}
            />
          )}

          {step.type === "transition" && (
            <div className="flex flex-col gap-10">
              <h3 className="page-title-small">{QUALIFICATION_INTRO}</h3>
              <button
                type="button"
                className={`${btnPrimary} w-fit`}
                onClick={() => go(1)}
              >
                Continue
              </button>
            </div>
          )}

          {step.type === "gate" && (
            <form
              onSubmit={submitGate}
              noValidate
              className="flex flex-col gap-6"
            >
              <h2 className="page-title-medium">{GATE.headline}</h2>
              <p className="p2 text-[var(--mesm-l-grey)] mb-4">
                {GATE.subhead}
              </p>

              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GATE_FIELDS.map((f) => (
                  <input
                    key={f.key}
                    type={f.type}
                    required
                    autoComplete={f.auto}
                    placeholder={f.label}
                    aria-label={f.label}
                    value={contact[f.key]}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, [f.key]: e.target.value }))
                    }
                    className={inputClass}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {GATE.checkboxes.map((c) => (
                  <label
                    key={c.key}
                    className="flex gap-3 items-start cursor-pointer text-base leading-snug"
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={contact[c.key]}
                      onChange={(e) =>
                        setContact((s) => ({ ...s, [c.key]: e.target.checked }))
                      }
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        "shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-[3px] border duration-200",
                        "peer-focus-visible:outline peer-focus-visible:outline-[var(--mesm-blue)]",
                        contact[c.key]
                          ? "bg-[var(--mesm-blue)] border-[var(--mesm-blue)]"
                          : "border-[var(--mesm-grey)]",
                      ].join(" ")}
                    >
                      {contact[c.key] && (
                        <img
                          src="/icons/check-black.png"
                          alt=""
                          className="w-3 h-3"
                        />
                      )}
                    </span>
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`${btnPrimary} w-full mt-6`}
              >
                {submitting ? "Scoring..." : GATE.button}
              </button>
              <p className="text-sm text-[var(--mesm-l-grey)] text-left">
                {GATE.microcopy}
              </p>
              {error && (
                <p role="status" className="text-red-600">
                  {error}
                </p>
              )}
            </form>
          )}

          {step.type === "results" && results && (
            <CmoResults
              results={results}
              pressure={answers.H3}
              firstName={contact.firstName.trim()}
              company={contact.company.trim()}
              share={share}
              contact={contact}
              quizId={quizId}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Outside the animated wrapper: its transform would stop `fixed` sticking */}
      {step.type === "results" && results && (
        <div className="fixed z-50 p-4 bottom-2 right-0 w-full md:w-fit items-center flex justify-center">
          <Button href="/connect" size="large" variant="CTA" arrow>
            Book a Strategy Session
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionScreen({
  q,
  answer,
  otherText,
  onSelect,
  onToggle,
  onOther,
  onContinue,
}) {
  const selected = (option, i) =>
    q.multi
      ? (answer || []).includes(i)
      : isHook(q)
        ? answer === option.value
        : answer === i;
  const otherOn = q.options.some((o, i) => o.other && selected(o, i));
  // Short option lists (industries, platforms) sit in two columns
  const compact =
    q.columns === 2 || q.options.every((o) => o.label.length <= 34);

  return (
    <fieldset className="flex flex-col gap-6">
      <legend className="mb-10">
        <h3 className="page-title-small">{q.question}</h3>
        {q.multi && (
          <p className="mt-2 text-[var(--mesm-l-grey)]">
            Select all that apply
          </p>
        )}
      </legend>

      <div
        className={`grid grid-cols-1 gap-2 ${compact ? "md:grid-cols-2" : ""}`}
        role={q.multi ? "group" : "radiogroup"}
      >
        {q.options.map((option, i) => {
          const isOn = selected(option, i);
          return (
            <button
              key={option.label}
              type="button"
              role={q.multi ? "checkbox" : "radio"}
              aria-checked={isOn}
              onClick={() =>
                q.multi ? onToggle(q, i) : onSelect(q, option, i)
              }
              className={[
                "text-left flex gap-4 items-center rounded-sm border-1 px-6 py-4 duration-200",
                isOn
                  ? "bg-[var(--mesm-blue)]/10 border-[var(--mesm-blue)]"
                  : "bg-[var(--mesm-grey-xd)] border-[var(--mesm-grey-dk)] hover:bg-[var(--mesm-grey)]/35 hover:border-[var(--mesm-grey)]",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "shrink-0 w-5 h-5 flex items-center justify-center border duration-200",
                  q.multi ? "rounded-[3px]" : "rounded-full",
                  isOn
                    ? "bg-[var(--mesm-blue)] border-[var(--mesm-blue)]"
                    : "border-[var(--mesm-grey)]",
                ].join(" ")}
              >
                {isOn && (
                  <img
                    src="/icons/check-black.png"
                    alt=""
                    className="w-3 h-3"
                  />
                )}
              </span>
              <span className="text-lg leading-snug">{option.label}</span>
            </button>
          );
        })}
      </div>

      {otherOn && (
        <input
          type="text"
          autoFocus
          maxLength={OTHER_MAX_LENGTH}
          placeholder={q.otherPlaceholder}
          aria-label={q.otherPlaceholder}
          value={otherText}
          onChange={(e) => onOther(q, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onContinue()}
          className={inputClass}
        />
      )}

      {(q.multi || otherOn) && (
        <button
          type="button"
          onClick={onContinue}
          className={`${btnPrimary} w-fit mt-6`}
        >
          Continue
        </button>
      )}
    </fieldset>
  );
}
