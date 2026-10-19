// One-off: creates the CMO Benchmark contact properties in HubSpot, and adds
// "CMO Benchmark" to the mesm_lead_source dropdown (contact updates fail without it).
// Usage: node --env-file=.env.local scripts/hubspot-cmo-properties.mjs
// Needs a private app token with crm.schemas.contacts.write. Safe to re-run (existing properties are skipped, but dropdown options are synced).

import {
  PILLARS,
  TIERS,
  H1,
  H3,
  INDUSTRIES,
  QUESTIONS,
  QUALIFICATION_QUESTIONS,
  CTA,
} from "../src/lib/cmo-benchmark/quizData.js";

const token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("Set HUBSPOT_ACCESS_TOKEN first.");
  process.exit(1);
}

const GROUP = "cmo_benchmark";
const LEAD_SOURCE = "CMO Benchmark";
const api = (path, body, method = "POST") =>
  fetch(`https://api.hubapi.com/crm/v3/properties/contacts${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
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
const platforms = QUESTIONS.find((q) => q.id === "CM9").options;

const properties = [
  dropdown("cmo_business_type", "CMO Business Type", opts(H1.options.map((o) => [o.value, o.label]))),
  dropdown("cmo_industry", "CMO Industry", fromLabels(INDUSTRIES)),
  text("cmo_industry_other", "CMO Industry (Other)"),
  dropdown("cmo_pressure", "CMO Biggest Pressure", opts(H3.options.map((o) => [o.value, o.label]))),
  number("cmo_score_overall", "CMO Overall Score"),
  dropdown("cmo_tier", "CMO Tier", fromLabels(TIERS.map((t) => t.name))),
  ...PILLARS.map((p) => number(`cmo_score_${p.key}`, `CMO Score: ${p.label}`)),
  dropdown("cmo_weakest_pillar", "CMO Weakest Pillar", opts(PILLARS.map((p) => [p.key, p.label]))),
  {
    name: "cmo_ad_platforms",
    label: "CMO Ad Platforms",
    type: "enumeration",
    fieldType: "checkbox",
    groupName: GROUP,
    options: opts(platforms.map((o) => [o.value, o.label])),
  },
  text("cmo_ad_platforms_other", "CMO Ad Platforms (Other)"),
  number("cmo_fit_score", "CMO Fit Score"),
  dropdown("cmo_fit_band", "CMO Fit Band", fromLabels(["High", "Mid", "Low"])),
  {
    name: "cmo_hot_lead",
    label: "CMO Hottest Lead (high fit + agency review + session)",
    type: "bool",
    fieldType: "booleancheckbox",
    groupName: GROUP,
    options: opts([["true", "Yes"], ["false", "No"]]),
  },
  dropdown("cmo_agency_review", "CMO Agency Under Review", yesNo),
  dropdown("cmo_revenue", "CMO Annual Revenue", qual.revenue),
  dropdown("cmo_budget", "CMO Annual Marketing Budget", qual.budget),
  dropdown("cmo_role", "CMO Role", qual.role),
  text("cmo_role_other", "CMO Role (Other)"),
  dropdown("cmo_partners", "CMO External Partners", qual.partners),
  dropdown("cmo_timeline", "CMO Timeline", qual.timeline),
  text("cmo_answers_summary", "CMO All Answers", "textarea"),
  text("cmo_call_opener", "CMO Call Opener"),
  // Nurture sequences should only enrol contacts where this is "yes"
  dropdown("cmo_marketing_optin", "CMO Marketing Opt-in", yesNo),
  // Set by the gate checkbox, and by the session form on the results page
  dropdown("cmo_session_requested", "CMO Session Requested", yesNo),
  dropdown("cmo_session_best_time", "CMO Session Best Time", fromLabels(CTA.session.form.bestTimes)),
  text("cmo_results_url", "CMO Results Page"),
  text("cmo_quiz_id", "CMO Quiz ID"),
];

const groupRes = await api("/groups", { name: GROUP, label: "CMO Benchmark" });
console.log(groupRes.ok ? "Created group" : `Group: ${groupRes.status} (likely exists)`);

for (const p of properties) {
  const res = await api("", p);
  if (res.ok) console.log(`✓ ${p.name}`);
  else if (res.status === 409 && p.options) {
    // Exists: sync its options, since HubSpot rejects values it doesn't know
    const patch = await api(`/${p.name}`, { label: p.label, options: p.options }, "PATCH");
    if (patch.ok) console.log(`↻ ${p.name} (options synced)`);
    else console.error(`✗ ${p.name}: ${patch.status} ${await patch.text()}`);
  } else if (res.status === 409) console.log(`- ${p.name} (exists)`);
  else console.error(`✗ ${p.name}: ${res.status} ${await res.text()}`);
}

// Add the lead source option, keeping the existing ones
const sourceRes = await api("/mesm_lead_source", undefined, "GET");
if (!sourceRes.ok) {
  console.error(`✗ mesm_lead_source: ${sourceRes.status} ${await sourceRes.text()}`);
} else {
  const { options } = await sourceRes.json();
  if (options.some((o) => o.value === LEAD_SOURCE)) {
    console.log(`- mesm_lead_source "${LEAD_SOURCE}" (exists)`);
  } else {
    const res = await api(
      "/mesm_lead_source",
      {
        options: [
          ...options,
          { value: LEAD_SOURCE, label: LEAD_SOURCE, displayOrder: options.length },
        ],
      },
      "PATCH"
    );
    if (res.ok) console.log(`✓ mesm_lead_source "${LEAD_SOURCE}"`);
    else console.error(`✗ mesm_lead_source: ${res.status} ${await res.text()}`);
  }
}
