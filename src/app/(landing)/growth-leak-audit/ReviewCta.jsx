"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CTA } from "@/lib/quiz/quizData";

const COPY = CTA.call;

// Mirrors <Button size="large"> (which renders a link, not a button):
// accent2 (pink) like the TwoColumn CTA for the opener, primary for submit
const btnBase = [
  "inline-flex items-center justify-center select-none border whitespace-nowrap",
  "duration-150 ease-out rounded-2xl hover:rounded-xl text-xl leading-tight px-4 py-2",
  "hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)] hover:text-[var(--mesm-l-grey)]",
  "disabled:opacity-40 disabled:cursor-not-allowed",
].join(" ");
const btnAccent = `${btnBase} bg-[var(--accent2)]/98 border-[var(--accent2)] text-[var(--background)]/98`;
const btnPrimary = `${btnBase} bg-[var(--mesm-blue)] border-[var(--mesm-blue)] text-[var(--background)]`;

const inputClass =
  "w-full border-b-1 border-[var(--mesm-grey-dk)] focus:border-[var(--mesm-blue)] p-[var(--global-margin-sm)] bg-transparent duration-200";

const FIELDS = [
  { key: "fullName", label: "Full name", type: "text", auto: "name" },
  { key: "email", label: "Email", type: "email", auto: "email" },
  { key: "phone", label: "Phone", type: "tel", auto: "tel" },
  { key: "company", label: "Company", type: "text", auto: "organization" },
];

// Two-column Growth Leak Review CTA: founder photo left, copy right. The button
// expands into a short request form; once sent, the thank-you message replaces
// the right column. contact pre-fills name, email & company from the gate (empty
// on a shared results link); quizId ties the request to the quiz's HubSpot contact.
export default function ReviewCta({ contact, resultsUrl, quizId }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: contact?.firstName || "",
    email: contact?.email || "",
    phone: "",
    company: contact?.company || "",
    bestTime: "",
    message: "",
  });
  const [hp, setHp] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (hp) return;

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please add your name, email and phone.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/growth-leak-audit/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, resultsUrl, quizId, hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      }
      setSent(true);
      window.dataLayer?.push({ event: "growth_leak_review_request" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="review"
      className="scroll-mt-24 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-start"
    >
      {/* Founder photo, caption underneath (same layout as the TwoColumn block) */}
      <figure className="!m-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={COPY.image}
            alt={COPY.caption}
            fill
            sizes="(min-width: 768px) 420px, 90vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-6 text-xs tracking-wide text-[var(--foreground)]/80">
          {COPY.caption}
        </figcaption>
      </figure>

      {sent ? (
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          role="status"
        >
          <h5 className="uppercase">{COPY.eyebrow}</h5>
          <h2>{COPY.thanks.headline(form.fullName.trim().split(/\s+/)[0])}</h2>
          <p>{COPY.thanks.body}</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          <h5 className="uppercase">{COPY.eyebrow}</h5>
          <h2>{COPY.headline}</h2>
          {COPY.body.map((p) => (
            <p key={p}>{p}</p>
          ))}

          <AnimatePresence initial={false} mode="wait">
            {!open ? (
              <motion.div
                key="button"
                className="flex flex-col items-start gap-3 mt-6"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  type="button"
                  className={btnAccent}
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                >
                  {COPY.button}
                </button>
                <p className="text-sm text-[var(--mesm-l-grey)]">
                  <em>{COPY.microcopy}</em>
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden flex flex-col gap-3 mt-6"
              >
                <h4 className="!mb-2">{COPY.form.heading}</h4>
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                  />
                </div>
                {FIELDS.map((f) => (
                  <input
                    key={f.key}
                    type={f.type}
                    required={f.key !== "company"}
                    autoComplete={f.auto}
                    placeholder={f.label}
                    aria-label={f.label}
                    value={form[f.key]}
                    onChange={set(f.key)}
                    className={inputClass}
                  />
                ))}

                <fieldset className="flex flex-col gap-3 mt-4">
                  <legend className="text-[var(--mesm-l-grey)] mb-3">
                    {COPY.form.bestTimeLabel}
                  </legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {COPY.form.bestTimes.map((t) => {
                      const isOn = form.bestTime === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={isOn}
                          onClick={() =>
                            setForm((f) => ({ ...f, bestTime: t }))
                          }
                          className={[
                            "rounded-2xl border px-4 py-1 duration-200",
                            isOn
                              ? "bg-[var(--mesm-blue)] border-[var(--mesm-blue)] text-[var(--background)]"
                              : "border-[var(--mesm-grey-dk)] hover:border-[var(--mesm-grey)]",
                          ].join(" ")}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <input
                  type="text"
                  maxLength={300}
                  placeholder={COPY.form.messagePlaceholder}
                  aria-label="Anything we should know before the call?"
                  value={form.message}
                  onChange={set("message")}
                  className={`${inputClass} mt-2`}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${btnPrimary} w-full mt-4`}
                >
                  {submitting ? "Sending..." : COPY.form.submit}
                </button>
                <p className="text-sm text-[var(--mesm-l-grey)] text-center">
                  <em>{COPY.form.microcopy}</em>
                </p>
                {error && (
                  <p role="status" className="text-red-600">
                    {error}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
