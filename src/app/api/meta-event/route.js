export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Server-side copies of quiz events that happen before any details are sent:
// QuizStart on the first answer, ViewContent on a shared results link.
// Lead only ever goes from the quiz's own submit route.
import { NextResponse } from "next/server";
import { sendBrowserEvent, validEventId } from "@/lib/metaCapi";
import { QUIZ_NAME as GROWTH_LEAK_AUDIT } from "@/lib/quiz/quizData";
import { QUIZ_NAME as CMO_BENCHMARK } from "@/lib/cmo-benchmark/quizData";

const EVENTS = ["QuizStart", "ViewContent"];
const QUIZZES = [GROWTH_LEAK_AUDIT, CMO_BENCHMARK];

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const { name, quizName, eventId } = body || {};
  if (
    !EVENTS.includes(name) ||
    !QUIZZES.includes(quizName) ||
    !validEventId(eventId)
  ) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  try {
    await sendBrowserEvent(req, { name, quizName, eventId });
  } catch (err) {
    console.error("Meta event failed:", err?.message);
  }
  // The browser doesn't wait on or retry this
  return NextResponse.json({ ok: true });
}
