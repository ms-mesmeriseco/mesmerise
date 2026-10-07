// One-off: creates the website form contact properties in HubSpot.
// Usage: HUBSPOT_ACCESS_TOKEN=pat-... node scripts/hubspot-form-properties.mjs
// Needs a token with crm.schemas.contacts.write. Safe to re-run (existing properties are skipped).

import { LEAD_SOURCES } from "../src/lib/hubspot.js";

const token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("Set HUBSPOT_ACCESS_TOKEN first.");
  process.exit(1);
}

const GROUP = "website_forms";
const api = (path, body) =>
  fetch(`https://api.hubapi.com/crm/v3/properties/contacts${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const text = (name, label, fieldType = "text") => ({
  name,
  label,
  type: "string",
  fieldType,
  groupName: GROUP,
});

const properties = [
  {
    name: "mesm_lead_source",
    label: "Latest Website Form",
    type: "enumeration",
    fieldType: "select",
    groupName: GROUP,
    options: Object.values(LEAD_SOURCES).map((l, displayOrder) => ({
      value: l,
      label: l,
      displayOrder,
    })),
  },
  text("mesm_services", "Enquiry Services"),
  text("mesm_budget", "Enquiry Budget"),
  text("mesm_enquiry_details", "Enquiry Details", "textarea"),
];

const groupRes = await api("/groups", { name: GROUP, label: "Website Forms" });
console.log(groupRes.ok ? "Created group" : `Group: ${groupRes.status} (likely exists)`);

for (const p of properties) {
  const res = await api("", p);
  if (res.ok) console.log(`✓ ${p.name}`);
  else if (res.status === 409) console.log(`- ${p.name} (exists)`);
  else console.error(`✗ ${p.name}: ${res.status} ${await res.text()}`);
}
