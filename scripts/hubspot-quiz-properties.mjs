// One-off: creates the Growth Leak Audit contact properties in HubSpot.
// Usage: node --env-file=.env.local scripts/hubspot-quiz-properties.mjs
// Needs a private app token with crm.schemas.contacts.write. Safe to re-run (existing properties are skipped).

import {
  PILLARS,
  PILLAR_LABELS,
  TIERS,
  H3,
  ALL_INDUSTRIES,
  QUALIFICATION_QUESTIONS,
} from "../src/lib/quiz/quizData.js";

const token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("Set HUBSPOT_ACCESS_TOKEN first.");
  process.exit(1);
}

const GROUP = "growth_leak_audit";
const api = (path, body) =>
  fetch(`https://api.hubapi.com/crm/v3/properties/contacts${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const opts = (pairs) =>
  pairs.map(([value, label], displayOrder) => ({ value, label, displayOrder }));
const fromLabels = (labels) => opts(labels.map((l) => [l, l]));
const dropdown = (name, label, options) => ({
  name,
  label,
  type: "enumeration",
  fieldType: "select",
  groupName: GROUP,
  options,
});
const number = (name, label) => ({
  name,
  label,
  type: "number",
  fieldType: "number",
  groupName: GROUP,
});

const text = (name, label, fieldType = "text") => ({
  name,
  label,
  type: "string",
  fieldType,
  groupName: GROUP,
});
const yesNo = opts([["yes", "Yes"], ["no", "No"]]);

const qual = Object.fromEntries(
  QUALIFICATION_QUESTIONS.map((q) => [q.key, fromLabels(q.options.map((o) => o.label))])
);

const properties = [
  dropdown("gla_track", "GLA Track", opts([["leadgen", "Lead gen"], ["ecom", "Ecom"], ["both", "Both"]])),
  dropdown("gla_industry", "GLA Industry", fromLabels(ALL_INDUSTRIES)),
  dropdown("gla_goal", "GLA Goal", opts(H3.options.map((o) => [o.value, o.label]))),
  number("gla_score_overall", "GLA Overall Score"),
  dropdown("gla_tier", "GLA Tier", fromLabels(TIERS.map((t) => t.name))),
  ...PILLARS.map((p) => number(`gla_score_${p.key}`, `GLA Score: ${PILLAR_LABELS.both[p.key]}`)),
  dropdown(
    "gla_weakest_pillar",
    "GLA Weakest Pillar",
    opts(PILLARS.map((p) => [p.key, PILLAR_LABELS.both[p.key]]))
  ),
  number("gla_fit_score", "GLA Fit Score"),
  dropdown("gla_fit_band", "GLA Fit Band", fromLabels(["High", "Mid", "Low"])),
  {
    name: "gla_hot_lead",
    label: "GLA Hot Lead (low score + high fit)",
    type: "bool",
    fieldType: "booleancheckbox",
    groupName: GROUP,
    options: opts([["true", "Yes"], ["false", "No"]]),
  },
  dropdown("gla_revenue", "GLA Annual Revenue", qual.revenue),
  dropdown("gla_spend", "GLA Monthly Spend", qual.spend),
  dropdown("gla_role", "GLA Role", qual.role),
  dropdown("gla_timeline", "GLA Timeline", qual.timeline),
  dropdown("gla_current_setup", "GLA Who Runs Marketing", qual.current_setup),
  // Nurture sequences should only enrol contacts where this is "yes"
  dropdown("gla_marketing_optin", "GLA Marketing Opt-in", yesNo),
  dropdown("gla_wants_call", "GLA Wants Growth Leak Review", yesNo),
  text("gla_call_opener", "GLA Call Opener", "textarea"),
  text("gla_answers", "GLA All Answers", "textarea"),
  text("gla_results_url", "GLA Results Page"),
  text("gla_quiz_id", "GLA Quiz ID"),
  // Set by the Growth Leak Review form at the base of the results page
  dropdown("gla_review_requested", "GLA Review Requested", yesNo),
  dropdown(
    "gla_review_best_time",
    "GLA Review Best Time",
    fromLabels(["Morning", "Afternoon", "Either"])
  ),
];

const groupRes = await api("/groups", { name: GROUP, label: "Growth Leak Audit" });
console.log(groupRes.ok ? "Created group" : `Group: ${groupRes.status} (likely exists)`);

for (const p of properties) {
  const res = await api("", p);
  if (res.ok) console.log(`✓ ${p.name}`);
  else if (res.status === 409) console.log(`- ${p.name} (exists)`);
  else console.error(`✗ ${p.name}: ${res.status} ${await res.text()}`);
}
