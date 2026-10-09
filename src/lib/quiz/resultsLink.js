// Signed, expiring results links: /growth-leak-audit/results/<token>
// The token carries the answers and an expiry date, signed with GLA_LINK_SECRET
// so it can't be extended or edited. Server-only (uses the secret).
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { PILLAR_LABELS } from "./quizData.js";
import { pickAnswers } from "./scoring.js";

const secret = process.env.GLA_LINK_SECRET;
const DAY = 24 * 60 * 60;

const sign = (payload) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

// { path, expires (ms) }, or null when GLA_LINK_SECRET isn't set
export function resultsLink(answers, days) {
  if (!secret) return null;
  const e = Math.floor(Date.now() / 1000) + days * DAY;
  const payload = Buffer.from(
    JSON.stringify({ a: pickAnswers(answers), e }),
  ).toString("base64url");
  return {
    path: `/growth-leak-audit/results/${payload}.${sign(payload)}`,
    expires: e * 1000,
  };
}

// { answers, expires } when valid, { expired: true } when past its date, null when
// missing, edited or malformed
export function verifyResultsToken(token) {
  if (!secret || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const { a, e } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!PILLAR_LABELS[a?.H1]) return null;
    if (Date.now() / 1000 > e) return { expired: true };
    return { answers: a, expires: e * 1000 };
  } catch {
    return null;
  }
}
