import {
  pillarsFor,
  TIERS,
  H1,
  H3,
  QUALIFICATION_QUESTIONS,
  QUESTION_META,
  DECISION_MAKER_ROLES,
  priorityFor,
  PRESSURE_OUTCOMES,
  OTHER_MAX_LENGTH,
  questionsFor,
  insightFor,
  term,
} from "./quizData.js";

// Only pillars scoring under this become priority cards
export const PRIORITY_MAX_SCORE = 60;
// "What's working" only shows a pillar at or above this
export const WORKING_MIN_SCORE = 60;

export const FLAGS = {
  strong: "✓",
  partial: "~",
  low: "✗",
  unsure: "?",
  unscored: "·",
};

const UNSURE =
  /not sure|i don['’]t know|no idea|haven['’]t tracked it closely|never modelled it/i;
const letter = (i) => String.fromCharCode(65 + i);

function flagFor(points, text) {
  if (points === null) return "unscored";
  if (UNSURE.test(text)) return "unsure";
  if (points >= 3) return "strong";
  if (points === 2) return "partial";
  return "low";
}

// Lowest points first; "?" answers win ties, then question order (stable sort)
const byWeakest = (a, b) =>
  a.points - b.points || (b.flag === "unsure") - (a.flag === "unsure");

// Points for one answer, or null when the question or the answer isn't scored
export function scoreQuestion(question, answer) {
  if (question.scored === false) return null;
  const option = question.options[answer];
  return option ? option.points : 0;
}

// One record per benchmark question: IDs, text and points, plus the library lines
function recordAnswer(question, answer, track) {
  const picks = question.multi
    ? (Array.isArray(answer) ? answer : []).filter((i) => question.options[i])
    : question.options[answer]
      ? [answer]
      : [];
  const points = scoreQuestion(question, answer);
  const text = picks.map((i) => question.options[i].label).join(", ");
  const flag = flagFor(points, text);
  const insight = insightFor(question, answer, points);
  const meta = QUESTION_META[question.id] || {};
  const isEcom = question.variant === "ecom";

  return {
    questionId: question.id,
    pillar: question.pillar,
    question: question.question,
    label:
      (track === "ecom" && meta.ecomLabel) || meta.label || question.question,
    answerId: picks.length
      ? `${question.id}_${picks.map(letter).join("+")}`
      : null,
    answer: text,
    points,
    flag,
    symbol: FLAGS[flag],
    agencyReview: picks.some((i) => question.options[i].agencyReview),
    opener: (isEcom && meta.ecomOpener) || meta.opener || null,
    read: insight?.read || null,
    told: insight?.told || null,
    why: insight?.why || null,
  };
}

export function tierFor(score) {
  return [...TIERS].reverse().find((t) => score >= t.min) || TIERS[0];
}

export function fitBandFor(fit) {
  if (fit >= 70) return "High";
  if (fit >= 40) return "Mid";
  return "Low";
}

/**
 * answers: { H1, H2, H2_other, H3, [CM id]: optionIndex | optionIndex[], CM9_other,
 *            Q1..Q5: optionIndex, Q3_other }
 */
export function computeResults(answers) {
  const track = answers.H1;
  const questions = questionsFor(track);
  const records = questions.map((q) => recordAnswer(q, answers[q.id], track));
  const scored = records.filter((r) => r.points !== null);

  const pillars = pillarsFor(track).map((p, order) => {
    const own = scored.filter((r) => r.pillar === p.key);
    const earned = own.reduce((sum, r) => sum + r.points, 0);
    const available = own.length * 3;
    return {
      key: p.key,
      label: p.label,
      weight: p.weight,
      order,
      score: available ? Math.round((earned / available) * 100) : 0,
      exact: available ? (earned / available) * 100 : 0,
      unsureCount: own.filter((r) => r.flag === "unsure").length,
      // 0 and 1 point answers, weakest first
      lowAnswers: own.filter((r) => r.points <= 1).sort(byWeakest),
    };
  });

  const overall = Math.round(
    pillars.reduce((sum, p) => sum + p.weight * p.exact, 0),
  );

  // Lowest first; ties go to the higher-weighted pillar, then the most "?"
  // answers, then pillar order
  const ranked = [...pillars].sort(
    (a, b) =>
      a.score - b.score ||
      b.weight - a.weight ||
      b.unsureCount - a.unsureCount ||
      a.order - b.order,
  );
  const topPillar = [...pillars].sort(
    (a, b) => b.score - a.score || b.weight - a.weight || a.order - b.order,
  )[0];

  // Priority cards come only from pillars under 60. "You told us" lists every
  // low answer that has a library line (the page shows two); "Why it matters"
  // comes from the weakest one.
  const priorities = ranked
    .filter((p) => p.score < PRIORITY_MAX_SCORE)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      ...priorityFor(p.key, track),
      told: p.lowAnswers.map((r) => r.told).filter(Boolean),
      why: p.lowAnswers.map((r) => r.why).find(Boolean) ?? null,
    }));

  const platformQuestion = questions.find((q) => q.id === "CM9");
  const adPlatforms = (Array.isArray(answers.CM9) ? answers.CM9 : [])
    .map((i) => platformQuestion.options[i])
    .filter(Boolean)
    // The typed "Other" text, when there is one
    .map((o) =>
      o.other && answers.CM9_other
        ? { ...o, label: `Other: ${answers.CM9_other}` }
        : o,
    );

  const fitScore = QUALIFICATION_QUESTIONS.reduce(
    (sum, q) => sum + (q.options[answers[q.id]]?.points ?? 0),
    0,
  );
  const qualOption = (key) => {
    const q = QUALIFICATION_QUESTIONS.find((x) => x.key === key);
    return q.options[answers[q.id]];
  };
  const role = qualOption("role")?.label;

  return {
    track,
    term: term(track),
    overall,
    tier: tierFor(overall),
    pillars,
    priorities,
    weakestPillar: ranked[0],
    topPillar,
    working:
      topPillar.score >= WORKING_MIN_SCORE
        ? { ...topPillar, working: priorityFor(topPillar.key, track).working }
        : null,
    answers: records,
    adPlatforms,
    unsure: records.filter((r) => r.flag === "unsure"),
    // Opener from the single weakest scored answer in the whole quiz
    callOpener:
      [...scored].sort(byWeakest).find((r) => r.opener)?.opener ?? null,
    isDecisionMaker: DECISION_MAKER_ROLES.includes(role),
    // CM25 "reviewing or replacing", or Q4 "Reviewing or replacing an agency"
    agencyReview:
      records.some((r) => r.agencyReview) ||
      Boolean(qualOption("partners")?.agencyReview),
    // CM25's read line, shown with the agency flag in the lead email
    agencyReviewRead: records.find((r) => r.agencyReview)?.read ?? null,
    fitScore,
    fitBand: fitBandFor(fitScore),
  };
}

// Hottest lead: high fit, an agency under review, and a session requested
export function isHotLead(results, sessionRequested) {
  return results.fitBand === "High" && results.agencyReview && sessionRequested;
}

// "A", "A and B", "A, B and C". Semicolons when a name has its own comma
// ("Data, CRM & martech").
function listOf(items) {
  if (items.length <= 1) return items.join("");
  const sep = items.some((i) => i.includes(",")) ? "; " : ", ";
  return `${items.slice(0, -1).join(sep)}${sep === "; " ? ";" : ""} and ${items.at(-1)}`;
}

const NUMBER_WORDS = ["", "One", "Two", "Three"];

// The shareable leadership summary, used on the results page, in the PDF and
// in the prospect's email
export function leadershipSummary(results, { company, pressure } = {}) {
  const { overall, tier, topPillar, priorities } = results;
  const who = company ? `${company}’s` : "Our";
  const outcome = PRESSURE_OUTCOMES[pressure]?.(results.term);
  const names = priorities.map((p) => p.label);

  const parts = [
    `${who} marketing function scores ${overall}/100 (${tier.name}).`,
    `Strongest area: ${topPillar.label}.`,
  ];
  if (names.length) {
    parts.push(
      `${NUMBER_WORDS[names.length]} ${names.length === 1 ? "priority" : "priorities"}: ${listOf(names)}.`,
    );
    if (outcome) {
      parts.push(
        `Addressing ${names.length === 1 ? "it" : "them"} would ${outcome}.`,
      );
    }
  } else {
    parts.push("Every pillar scores 60 or above.");
  }
  return parts.join(" ");
}

export const hookLabel = (q, value) =>
  q.options.find((o) => o.value === value)?.label || "";

// Industry for display: the typed "Other" text when there is one
export function industryLabel(answers) {
  if (answers.H2 === "Other" && answers.H2_other) {
    return `Other: ${answers.H2_other}`;
  }
  return answers.H2 || "";
}

export const businessTypeLabel = (answers) => hookLabel(H1, answers.H1);
export const pressureLabel = (answers) => hookLabel(H3, answers.H3);

// Only the answer keys the quiz uses (drops anything else the client sent),
// with the free-text fields trimmed to length
export function pickAnswers(answers) {
  const keys = [
    "H1",
    "H2",
    "H2_other",
    "H3",
    ...questionsFor(answers.H1).map((q) => q.id),
    ...QUALIFICATION_QUESTIONS.map((q) => q.id),
    "Q3_other",
    "CM9_other",
  ];
  const picked = Object.fromEntries(
    keys.filter((k) => answers[k] !== undefined).map((k) => [k, answers[k]]),
  );
  for (const k of ["H2_other", "Q3_other", "CM9_other"]) {
    if (picked[k] === undefined) continue;
    const text = String(picked[k]).trim().slice(0, OTHER_MAX_LENGTH);
    if (text) picked[k] = text;
    else delete picked[k];
  }
  return picked;
}
