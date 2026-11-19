// Meta Conversions API: server-side copies of the quiz's pixel events. Each copy
// reuses the browser event's event_id, so Meta counts the pair once.
// Server-only (uses the access token).
import "server-only";
import { createHash } from "node:crypto";

const DATASET_ID = "1448494526204583"; // same ID as the pixel in app/layout.js
const API_VERSION = "v24.0";
const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;
// Set to a code from Events Manager > Test events to see server events arrive there
const testEventCode = process.env.FB_CAPI_TEST_EVENT_CODE;

// Each event's params, matching what the browser sends (lib/metaPixel.js)
const CUSTOM_DATA = {
  QuizStart: (quizName) => ({ quiz_name: quizName }),
  Lead: (quizName) => ({ content_name: quizName, quiz_name: quizName }),
  ViewContent: (quizName) => ({ content_name: `${quizName} results` }),
};

// Personal details are only ever sent hashed
const hash = (value) =>
  value
    ? [createHash("sha256").update(value.trim().toLowerCase()).digest("hex")]
    : undefined;

// event_ids come from the browser, so only accept something shaped like one
export const validEventId = (id) =>
  typeof id === "string" && /^[\w-]{8,64}$/.test(id) ? id : null;

const cookie = (header, name) =>
  header?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];

// The browser details Meta matches on, sent with every event: _fbp and _fbc
// cookies, IP and user agent, plus hashed email and first name when known
function userData(req, { email, firstName, attribution } = {}) {
  const headers = req.headers;
  const cookies = headers.get("cookie");
  // No _fbc cookie (blocked, or another browser tab): build it from the saved
  // fbclid, in Meta's fb.1.<click time ms>.<fbclid> format
  const fbclid = attribution?.fbclid;
  const fbc =
    cookie(cookies, "_fbc") ||
    (fbclid
      ? `fb.1.${attribution.captured_at || Date.now()}.${fbclid}`
      : undefined);
  return {
    em: hash(email),
    fn: hash(firstName),
    client_ip_address:
      headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
    client_user_agent: headers.get("user-agent") || undefined,
    fbp: cookie(cookies, "_fbp"),
    fbc,
  };
}

// events: [[event_name, event_id]]; ones without a valid event_id are skipped
async function sendEvents(req, quizName, events, details) {
  if (!accessToken) return;
  const base = {
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    // The page the request came from
    event_source_url: req.headers.get("referer") || undefined,
    user_data: userData(req, details),
  };
  const data = events
    .filter(([name, id]) => CUSTOM_DATA[name] && validEventId(id))
    .map(([event_name, event_id]) => ({
      ...base,
      event_name,
      event_id,
      custom_data: CUSTOM_DATA[event_name](quizName),
    }));
  if (!data.length) return;

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${DATASET_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data,
        ...(testEventCode && { test_event_code: testEventCode }),
      }),
    },
  );
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(
      `Meta CAPI ${res.status}: ${detail.error?.message || "request failed"}`,
    );
  }
}

// On details submission: Lead and the results ViewContent, with hashed email
// and first name. QuizStart went earlier, through /api/meta-event.
export function sendQuizEvents(
  req,
  { quizName, eventIds, email, firstName, attribution },
) {
  return sendEvents(
    req,
    quizName,
    [
      ["Lead", eventIds?.lead],
      ["ViewContent", eventIds?.viewContent],
    ],
    { email, firstName, attribution },
  );
}

// An event sent as it happens in the browser (QuizStart, a shared results
// ViewContent). No personal details are known yet.
export function sendBrowserEvent(req, { name, quizName, eventId }) {
  return sendEvents(req, quizName, [[name, eventId]]);
}
