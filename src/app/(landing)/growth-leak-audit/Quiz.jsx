"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  INTRO,
  H1,
  H3,
  industryQuestion,
  questionsForTrack,
  QUALIFICATION_INTRO,
  QUALIFICATION_QUESTIONS,
  GATE,
} from "@/lib/quiz/quizData";
import { computeResults } from "@/lib/quiz/scoring";
import QuizResults from "./QuizResults";

// 3 hook + 15 scored + 5 qualification
const TOTAL_QUESTIONS = 23;
const ADVANCE_DELAY = 280;

// Hook answers are stored by value, everything else by option index
const isHook = (q) => q.id.startsWith("H");

function buildSteps(track) {
  const steps = [{ type: "intro" }, { type: "question", q: H1 }];
  if (!track) return steps;
  return [
    ...steps,
    { type: "question", q: industryQuestion(track) },
    { type: "question", q: H3 },
    ...questionsForTrack(track).map((q) => ({ type: "question", q })),
    { type: "transition" },
    ...QUALIFICATION_QUESTIONS.map((q) => ({ type: "question", q })),
    { type: "gate" },
    { type: "results" },
  ];
}

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

// skipIntro: start on the first question (the landing hero acts as the intro).
// onExit: called when Back is pressed on the first screen.
export default function Quiz({ skipIntro = false, onExit } = {}) {
  const firstStep = skipIntro ? 1 : 0;
  const [stepIndex, setStepIndex] = useState(firstStep);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({
    firstName: "",
    email: "",
    company: "",
    website: "",
  });
  const [hp, setHp] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const advanceTimer = useRef(null);
  const topRef = useRef(null);

  const track = answers.H1;
  const steps = useMemo(() => buildSteps(track), [track]);
  const step = steps[stepIndex];

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
    setAnswers((a) => ({ ...a, [q.id]: value }));
    clearTimeout(advanceTimer.current);
    // H1 changes the step list, so advance by index rather than relative to stale steps
    advanceTimer.current = setTimeout(() => {
      setStepIndex((i) => i + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, ADVANCE_DELAY);
  }

  function toggleMulti(q, index) {
    setAnswers((a) => {
      const current = a[q.id] || [];
      const next = current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index];
      return { ...a, [q.id]: next };
    });
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
    if (!/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(website.trim())) {
      setError("Please enter a valid website URL.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/growth-leak-audit", {
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

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "growth_leak_audit_complete",
          gla_track: track,
          gla_score_overall: computed.overall,
          gla_tier: computed.tier.name,
          gla_fit_band: computed.fitBand,
        });
        window.fbq?.("track", "Lead", { content_name: "Growth Leak Audit" });
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
      {step.type !== "intro" && step.type !== "results" && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <button
              type="button"
              onClick={() =>
                stepIndex === firstStep && onExit ? onExit() : go(-1)
              }
              className="text-sm text-[var(--mesm-l-grey)] hover:text-[var(--foreground)] duration-200 "
            >
              &lt;&lt; &nbsp;previous
            </button>
            {step.type === "question" && (
              <h6 className="tabular-nums text-[var(--mesm-l-grey)]">
                {String(questionNumber).padStart(2, "0")} / {TOTAL_QUESTIONS}
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
          {step.type === "intro" && (
            <div className="flex flex-col gap-6">
              <p className="p3">{INTRO.body[0]}</p>
              <p className="p2 text-[var(--mesm-l-grey)]">{INTRO.body[1]}</p>
              <button
                type="button"
                className={`${btnPrimary} w-fit mt-6`}
                onClick={() => go(1)}
              >
                {INTRO.button}
              </button>
            </div>
          )}

          {step.type === "question" && (
            <QuestionScreen
              q={step.q}
              answer={answers[step.q.id]}
              onSelect={selectSingle}
              onToggle={toggleMulti}
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
                {[
                  {
                    key: "firstName",
                    label: "First name",
                    type: "text",
                    auto: "given-name",
                  },
                  {
                    key: "email",
                    label: "Work email",
                    type: "email",
                    auto: "email",
                  },
                  {
                    key: "company",
                    label: "Company",
                    type: "text",
                    auto: "organization",
                  },
                  {
                    key: "website",
                    label: "Website URL",
                    type: "url",
                    auto: "url",
                  },
                ].map((f) => (
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

              <button
                type="submit"
                disabled={submitting}
                className={`${btnPrimary} w-full mt-6`}
              >
                {submitting ? "Scoring..." : GATE.button}
              </button>
              <p className="text-sm text-[var(--mesm-l-grey)] text-center">
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
            <QuizResults results={results} goal={answers.H3} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuestionScreen({ q, answer, onSelect, onToggle, onContinue }) {
  const selected = (option, i) =>
    q.multi
      ? (answer || []).includes(i)
      : isHook(q)
        ? answer === option.value
        : answer === i;
  // Short option lists (industries, channels) sit in two columns
  const compact = q.options.every((o) => o.label.length <= 34);

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

      {q.multi && (
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
