// Meta Pixel events with an event_id, so a server-side (Conversions API) copy
// of the same event can reuse the ID and Meta counts it once.
// The pixel itself loads in app/layout.js.
import { useEffect, useRef, useState } from "react";

export const newEventId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

// A standard event, or a custom one with { custom: true }. Returns the event_id.
export function trackMeta(
  name,
  params,
  { eventId = newEventId(), custom = false } = {},
) {
  window.fbq?.(custom ? "trackCustom" : "track", name, params, {
    eventID: eventId,
  });
  return eventId;
}

// Asks the server to send its Conversions API copy of an event that has no
// submission to ride on (QuizStart, a shared results ViewContent). Fire and forget.
function sendServerCopy(name, quizName, eventId) {
  fetch("/api/meta-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quizName, eventId }),
    keepalive: true,
  }).catch(() => {});
}

// Meta tracking for a quiz. Every quiz uses this so events, params and
// event_ids match across quizzes:
//   markStarted()  on every answer; only the first sends QuizStart (browser
//                  and server)
//   trackLead()    once the details form is saved; the only Lead a quiz sends
//   eventIds()     sent with the submission as metaEventIds, so the API route's
//                  Lead and ViewContent copies (lib/metaCapi.js) reuse the IDs
//   viewEventId    passed to the results view for useResultsView
// resumed: the quiz picked up saved answers, so QuizStart fired on an earlier visit.
export function useQuizTracking(quizName, { resumed = false } = {}) {
  const [ids] = useState(() => ({
    quizStart: newEventId(),
    lead: newEventId(),
    viewContent: newEventId(),
  }));
  const started = useRef(false);
  const skipStart = useRef(resumed);

  return {
    markStarted() {
      if (started.current || skipStart.current) return;
      started.current = true;
      trackMeta(
        "QuizStart",
        { quiz_name: quizName },
        { custom: true, eventId: ids.quizStart },
      );
      sendServerCopy("QuizStart", quizName, ids.quizStart);
    },
    trackLead() {
      trackMeta(
        "Lead",
        { content_name: quizName, quiz_name: quizName },
        { eventId: ids.lead },
      );
    },
    eventIds: () => ({ lead: ids.lead, viewContent: ids.viewContent }),
    viewEventId: ids.viewContent,
  };
}

// ViewContent once per results view (the ref survives Strict Mode's re-run).
// After a submission the server copy went with it; a shared results link passes
// no eventId, so it gets a fresh one and its own server copy.
export function useResultsView(quizName, eventId) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const id = trackMeta(
      "ViewContent",
      { content_name: `${quizName} results` },
      { eventId },
    );
    if (!eventId) sendServerCopy("ViewContent", quizName, id);
  }, [quizName, eventId]);
}
