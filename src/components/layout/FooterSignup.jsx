"use client";

import { useState } from "react";

export default function FooterSignup({
  className = "",
  submitPath = "/api/newsletter",
  cta = "Join the community",
  successMsg = "You're in!",
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { ok: boolean, msg?: string }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (website) return; // bot

    if (!name.trim() || !email.trim()) {
      setStatus({ ok: false, msg: "Please add your name and email." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(submitPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to subscribe.");

      setStatus({ ok: true });
      setName("");
      setEmail("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  // Compact, footer-friendly layout
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={[
        "w-full",
        "flex flex-col gap-8 justify-between",
        className,
      ].join(" ")}
      aria-describedby="signup-status"
    >
      {/* Honeypot */}
      <label className="hidden" aria-hidden="true">
        Website
        <input
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>

      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="flex-1 min-w-0 border-b-1 border-[var(--mesm-grey-dk)] bg-transparent p-[var(--global-margin-xs)] text-[var(--foreground)] placeholder-[var(--mesm-grey)]"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Your email"
        className="flex-1 min-w-0 border-b-1 border-[var(--mesm-grey-dk)] bg-transparent p-[var(--global-margin-xs)] text-[var(--foreground)] placeholder-[var(--mesm-grey)]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-2xl border-1 border-[var(--mesm-grey-dk)]  px-4 py-2 text-[var(--foreground)] hover:bg-[var(--accent2)] hover:text-[var(--background)] duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Submitting..." : cta}
      </button>

      {/* Inline status / thank you */}
      <div
        id="signup-status"
        role="status"
        aria-live="polite"
        className="min-h-[1.5rem] text-md"
      >
        {status &&
          (status.ok ? (
            <span className="text-[var(--mesm-blue)]">{successMsg}</span>
          ) : (
            <span className="text-[var(--mesm-red)]">{status.msg}</span>
          ))}
      </div>
    </form>
  );
}
