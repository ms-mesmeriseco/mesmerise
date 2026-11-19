// Meta Pixel events with an event_id, so a server-side (Conversions API) copy
// of the same event can reuse the ID and Meta counts it once.
// The pixel itself loads in app/layout.js.
import { useEffect, useRef } from "react";

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

// ViewContent once per results view (the ref survives Strict Mode's re-run)
export function useViewContent(contentName, eventId) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackMeta("ViewContent", { content_name: contentName }, { eventId });
  }, [contentName, eventId]);
}
