// Signed, expiring results links: /cmo-benchmark/results/<token>
// The token carries the answers, first name, company and an expiry date, signed
// with GLA_LINK_SECRET so it can't be extended or edited. Signatures are prefixed
// with "cmo." so a Growth Leak Audit link never verifies here (or the reverse).
// Server-only (uses the secret).
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { H1 } from "./quizData.js";
import { pickAnswers } from "./scoring.js";

const secret = process.env.GLA_LINK_SECRET;
const DAY = 24 * 60 * 60;

const sign = (payload) =>
  createHmac("sha256", secret).update(`cmo.${payload}`).digest("base64url");

// { path, expires (ms) }, or null when GLA_LINK_SECRET isn't set
export function resultsLink(answers, { firstName, company }, days) {
  if (!secret) return null;
  const e = Math.floor(Date.now() / 1000) + days * DAY;
  const payload = Buffer.from(
    JSON.stringify({ a: pickAnswers(answers), f: firstName, c: company, e }),
  ).toString("base64url");
  return {
    path: `/cmo-benchmark/results/${payload}.${sign(payload)}`,
    expires: e * 1000,
  };
}

// { answers, firstName, company, expires } when valid, { expired: true } when
// past its date, null when missing, edited or malformed
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
    const { a, f, c, e } = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    );
    if (!H1.options.some((o) => o.value === a?.H1)) return null;
    if (Date.now() / 1000 > e) return { expired: true };
    return {
      answers: a,
      firstName: f || "",
      company: c || "",
      expires: e * 1000,
    };
  } catch {
    return null;
  }
}
