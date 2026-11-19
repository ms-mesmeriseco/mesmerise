// Where a visitor came from: campaign tags (utm_*), Meta's click ID (fbclid),
// the page they landed on and the site that sent them. Saved in the browser
// on landing and sent with quiz submissions, so the team email can show it.
// Storage can be missing or blocked (private windows, cleared site data), so
// every browser call fails quietly.

const KEY = "mesm-attribution";
const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_LENGTH = 300;

// [key, label for the team email]
export const ATTRIBUTION_FIELDS = [
  ["utm_source", "Source"],
  ["utm_medium", "Medium"],
  ["utm_campaign", "Campaign"],
  ["utm_content", "Content"],
  ["utm_term", "Term"],
  ["fbclid", "fbclid"],
  ["landing_page", "Landing page"],
  ["referrer", "Referrer"],
];
const TAGS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
];

// On each full page load. A link with campaign tags replaces what's saved (the
// latest ad click wins); a visit without them only fills an empty slot.
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const tagged = TAGS.some((k) => params.get(k));
    if (!tagged && getAttribution()) return;

    const referrer =
      document.referrer &&
      new URL(document.referrer).host !== window.location.host
        ? document.referrer
        : "";
    const saved = { captured_at: Date.now() };
    for (const k of TAGS) if (params.get(k)) saved[k] = params.get(k);
    saved.landing_page = window.location.href;
    if (referrer) saved.referrer = referrer;
    window.localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {}
}

// The saved attribution, or null when there's none or it's over 30 days old
export function getAttribution() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY));
    if (!saved || Date.now() - saved.captured_at > MAX_AGE) return null;
    return saved;
  } catch {
    return null;
  }
}

// Server side: keep only known fields, as short strings
export function cleanAttribution(raw) {
  const clean = {};
  if (!raw || typeof raw !== "object") return clean;
  for (const [k] of ATTRIBUTION_FIELDS) {
    if (typeof raw[k] === "string" && raw[k].trim()) {
      clean[k] = raw[k].trim().slice(0, MAX_LENGTH);
    }
  }
  if (Number.isFinite(raw.captured_at)) clean.captured_at = raw.captured_at;
  return clean;
}
