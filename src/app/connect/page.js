"use client";

import { useState } from "react";
import PageTitleLarge from "@/components/layout/PageTitleLarge";
import StaggeredWords from "@/hooks/StaggeredWords";
import StaggeredChildren from "@/hooks/StaggeredChildren";
import CopyEmailButton from "@/components/ui/CopyEmailButton";

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
          ? "bg-[var(--mesm-blue)]  text-[var(--background)] border-transparent"
          : "bg-[var(--foreground)] text-[var(--background)] hover:bg-transparent hover:text-[var(--mesm-grey)] hover:border-[var(--mesm-grey-dk)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function Connect() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          phone,
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

      setStatus({ ok: true, msg: "Thank you! We'll be in touch shortly." });
      setFullName("");
      setEmail("");
      setPhone("");
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
    <div className="flex flex-col min-h-screen gap-[var(--global-margin-lg)]">
      <PageTitleLarge text="Connect" />

      {/* Middle Row */}
      <div className="flex w-full justify-between gap-[var(--global-margin-sm)]">
        {/* Form */}
        <div className="w-full md:w-1/2 p-[var(--global-margin-xs)]">
          <StaggeredWords as="h3" text="Send us a love letter" />

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
                placeholder="Email"
                className="w-full border-b-1 p-[var(--global-margin-sm)] bg-transparent"
                aria-label="Email address"
              />
              <input
                type="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full border-b-1 p-[var(--global-margin-sm)] bg-transparent"
                aria-label="Phone number"
              />

              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
                className="w-full border-b-1 p-[var(--global-margin-sm)] bg-transparent"
                aria-label="Company name"
              />
            </div>

            {/* Services Multi-Select */}
            <fieldset className="space-y-3">
              <legend className="block text-md tracking-wide">
                What are you interested in?
              </legend>

              <StaggeredChildren once={true} className="flex flex-wrap gap-1">
                {SERVICE_OPTIONS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    selected={services.includes(s)}
                    onClick={() => toggle(services, s, setServices)}
                  />
                ))}
              </StaggeredChildren>
            </fieldset>

            {/* Budget Multi-Select */}
            <fieldset className="space-y-3">
              <legend className="block text-md tracking-wide">
                Do you have a budget?
              </legend>

              <StaggeredChildren once={true} className="flex flex-wrap gap-1">
                {BUDGET_OPTIONS.map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    selected={budgets.includes(b)}
                    onClick={() => toggle(budgets, b, setBudgets)}
                  />
                ))}
              </StaggeredChildren>
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
              className="w-full bg-none rounded-2xl border-1 border-[var(--foreground)] duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)] py-2 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="p2">{submitting ? "Sending..." : "Submit"}</p>
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
      <h6>Or go direct to source:</h6>
      <div className="flex flex-col md:flex-row md:h-[40vh] h-[60vh] gap-[var(--global-margin-xs)] border-t-1 pt-[var(--global-margin-sm)] border-[var(--mesm-grey-dk)]">
        <div className="flex-1 border-1 border-[var(--mesm-grey-dk)] rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--mesm-yellow)] hover:text-[var(--background)] text-[var(--foreground)]">
          <a
            href="tel:+61477210477"
            className="w-full h-full  font-normal text-left flex-start flex"
          >
            <button className="w-full h-full md:text-4xl text-2xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
              Call
              <br />
              +61 477 210 477
            </button>
          </a>
        </div>
        <div className="flex-1 border-1 border-[var(--mesm-grey-dk)] rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--mesm-yellow)] hover:text-[var(--background)] text-[var(--foreground)] cursor-pointer">
          <CopyEmailButton email="hello@mesmeriseco.com" label="Email" />
        </div>
      </div>
    </div>
  );
}
