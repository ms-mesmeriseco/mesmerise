"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CROForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (website) return; // bot

    if (!name.trim() || !email.trim()) {
      setStatus({ ok: false, msg: "Please provide your name and email." });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/cro-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          website, // honeypot
          source: "cro-checklist",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send. Please try again.");
      }

      // Success — redirect to the success page
      router.push("/cro-checklist-success");
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6 w-full" onSubmit={handleSubmit} noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex="-1"
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full border-b-1 p-[var(--global-margin-sm)] bg-transparent"
          aria-label="Full name"
        />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full border-b-1 p-[var(--global-margin-sm)] bg-transparent"
          aria-label="Email address"
        />
      </div>

      {/* Submit Button — matches contact form */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-none rounded-2xl border-1 border-[var(--foreground)] duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-2 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <p className="p2">
          {submitting ? "Submitting..." : "Get Instant Access"}
        </p>
      </button>

      {/* Status Message */}
      {status && (
        <p
          role="status"
          className={status.ok ? "text-green-600" : "text-red-600"}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}
