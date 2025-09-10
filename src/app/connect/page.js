"use client";

import { useState } from "react";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

const SERVICE_OPTIONS = [
  "Branding",
  "Website",
  "Strategy",
  "Sales",
  "Lead Acquisition",
  "Defined Project",
  "Continuous Project",
];

const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000-$10,000",
  "$10,000-$30,000",
  "$30,000-$50,000",
  "$50,000 +",
];

function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "px-3 py-0 rounded-xl border-1 transition-colors",
        "border-[var(--mesm-grey-dk)] cursor-pointer",
        selected
          ? "bg-[var(--mesm-blue)] text-[var(--foreground)] border-transparent"
          : "bg-[var(--foreground)] text-[var(--background)] hover:bg-transparent hover:text-[var(--foreground)] hover:border-[var(--foreground)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function Connect() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [services, setServices] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // Honeypot (hidden) for bots
  const [website, setWebsite] = useState("");

  const toggle = (arr, value, setter) =>
    setter(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    );

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (website) return; // bot

    if (!fullName.trim() || !email.trim()) {
      setStatus({ ok: false, msg: "Please provide your name and email." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          company,
          services,
          budgets,
          details,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send. Please try again.");
      }

      setStatus({ ok: true, msg: "Thanks! We’ll be in touch shortly." });
      setFullName("");
      setEmail("");
      setCompany("");
      setServices([]);
      setBudgets([]);
      setDetails("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen gap-[var(--global-margin-lg)] p-[var(--global-margin-lg)]">
      <PageTitleLarge text="Connect" />

      {/* Middle Row */}
      <div className="flex w-full justify-between gap-[var(--global-margin-sm)]">
        {/* Form */}
        <div className="w-full md:w-1/2 p-[var(--global-margin-xs)]">
          <h3 className="text-xl mb-4">Send us a love letter</h3>

          <form className="space-y-6 w-full" onSubmit={onSubmit} noValidate>
            {/* Honeypot (hidden) */}
            <div className="hidden">
              <label>
                Website
                <input
                  type="text"
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="w-full border-b-1 p-[var(--global-margin-sm)] bg-transparent"
                aria-label="Company name"
              />
            </div>

            {/* Services Multi-Select */}
            <fieldset className="space-y-3">
              <legend className="block text-md tracking-wide">
                How can we help you?
              </legend>
              <div className="flex flex-wrap gap-1">
                {SERVICE_OPTIONS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    selected={services.includes(s)}
                    onClick={() => toggle(services, s, setServices)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Budget Multi-Select */}
            <fieldset className="space-y-3">
              <legend className="block text-md tracking-wide">
                What's your budget?
              </legend>
              <div className="flex flex-wrap gap-1">
                {BUDGET_OPTIONS.map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    selected={budgets.includes(b)}
                    onClick={() => toggle(budgets, b, setBudgets)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Details */}
            <div className="space-y-2">
              <label className="block text-md tracking-wide" htmlFor="details">
                Any more details about your project?
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="What challenges are you having? What are your goals?"
                className="w-full border-b-1 p-[var(--global-margin-sm)] h-32 bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-none rounded-md border-1 border-[var(--foreground)] duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-2 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p>{submitting ? "Sending..." : "Submit"}</p>
            </button>

            {status && (
              <p
                role="status"
                className={status.ok ? "text-green-600" : "text-red-600"}
              >
                {status.msg}
              </p>
            )}
          </form>
        </div>

        {/* Right column for balance */}
        <div className="hidden md:block w-1/2" />
      </div>

      {/* Bottom Row (unchanged) */}
      <div className="flex h-[40vh] gap-[var(--global-margin-sm)]">
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Call
          </button>
        </div>
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
