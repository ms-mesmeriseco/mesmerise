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

const hash = (value) =>
  value
    ? [createHash("sha256").update(value.trim().toLowerCase()).digest("hex")]
    : undefined;

// event_ids come from the browser, so only accept something shaped like one
const validId = (id) =>
  typeof id === "string" && /^[\w-]{8,64}$/.test(id) ? id : null;

const cookie = (header, name) =>
  header?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];

// The quiz's QuizStart, Lead and ViewContent events, sent once the details are in.
// QuizStart is skipped when it fired on an earlier visit (no event_id for it).
export async function sendQuizEvents(
  req,
  { quizName, eventIds, email, firstName },
) {
  if (!accessToken) return;

  const headers = req.headers;
  const cookies = headers.get("cookie");
  const base = {
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: headers.get("referer") || undefined,
    user_data: {
      em: hash(email),
      fn: hash(firstName),
      client_ip_address:
        headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined,
      client_user_agent: headers.get("user-agent") || undefined,
      fbp: cookie(cookies, "_fbp"),
      fbc: cookie(cookies, "_fbc"),
    },
  };

  const events = [
    ["QuizStart", eventIds?.quizStart, { quiz_name: quizName }],
    ["Lead", eventIds?.lead, { content_name: quizName, quiz_name: quizName }],
    [
      "ViewContent",
      eventIds?.viewContent,
      { content_name: `${quizName} results` },
    ],
  ]
    .filter(([, id]) => validId(id))
    .map(([event_name, event_id, custom_data]) => ({
      ...base,
      event_name,
      event_id,
      custom_data,
    }));
  if (!events.length) return;

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${DATASET_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: events,
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
