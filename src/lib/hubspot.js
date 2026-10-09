const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;

// Values for the mesm_lead_source contact property (see scripts/hubspot-form-properties.mjs)
export const LEAD_SOURCES = {
  contact: "Contact form",
  newsletter: "Newsletter",
  cro_checklist: "CRO checklist",
  marketing_matrix: "Marketing matrix",
  growth_leak_audit: "Growth Leak Audit",
};

/**
 * Create or update a HubSpot contact by email. No-op when HUBSPOT_ACCESS_TOKEN
 * isn't set. Empty values are dropped so they don't wipe existing data.
 * Throws on API errors — callers decide whether that should block the form.
 * Returns the contact's HubSpot ID.
 */
export async function upsertHubspotContact(email, properties) {
  if (!hubspotToken) return;

  email = String(email).trim().toLowerCase();
  const clean = Object.fromEntries(
    Object.entries({ ...properties, email }).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const res = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hubspotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [{ idProperty: "email", id: email, properties: clean }],
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  }
  const data = await res.json().catch(() => null);
  return data?.results?.[0]?.id ?? null;
}

// Link to a contact record in the HubSpot app. Uses HUBSPOT_PORTAL_ID, or looks
// the portal up once from the token.
let portalId = process.env.HUBSPOT_PORTAL_ID || null;

export async function hubspotContactUrl(contactId) {
  if (!contactId || !hubspotToken) return null;
  if (!portalId) {
    const res = await fetch("https://api.hubapi.com/account-info/v3/details", {
      headers: { Authorization: `Bearer ${hubspotToken}` },
    }).catch(() => null);
    portalId = res?.ok ? (await res.json()).portalId : null;
    if (!portalId) return null;
  }
  return `https://app.hubspot.com/contacts/${portalId}/record/0-1/${contactId}`;
}

export function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  return { firstname: parts[0] || "", lastname: parts.slice(1).join(" ") };
}
