import {
  PILLARS,
  PILLAR_LABELS,
  TIERS,
  QUALIFICATION_QUESTIONS,
  questionsForTrack,
  QUESTION_META,
  DECISION_MAKER_ROLES,
  leakFor,
  insightFor,
} from "./quizData.js";

// Diagnostic scores below this, combined with high fit, are flagged for same-day outreach
export const HOT_LEAD_MAX_SCORE = 60;
// Only pillars scoring under this become leak cards
export const LEAK_MAX_SCORE = 60;
export const NO_LEAKS_MESSAGE =
  "No major leaks found. Every pillar scored 60 or above. Your next gains are in fine-tuning.";

export const FLAGS = {
  strong: "✓",
  partial: "~",
  leak: "✗",
  unsure: "?",
};

const UNSURE = /not sure|i don['’]t know|no idea/i;
const letter = (i) => String.fromCharCode(65 + i);

function flagFor(points, text) {
  if (UNSURE.test(text)) return "unsure";
  if (points >= 3) return "strong";
  if (points === 2) return "partial";
  return "leak";
}

// Lowest points first; "?" answers win ties, then question order (stable sort)
const byWeakest = (a, b) =>
  a.points - b.points || (b.flag === "unsure") - (a.flag === "unsure");

// One record per scored question: IDs, text and points, plus the library lines
function recordAnswer(question, answer, track) {
  const picks = question.multi
    ? (answer || []).filter((i) => question.options[i])
    : question.options[answer]
      ? [answer]
      : [];
  const points = scoreQuestion(question, answer);
  const text = picks.map((i) => question.options[i].label).join(", ");
  const flag = flagFor(points, text);
  const insight = insightFor(question, answer, points);

  return {
    questionId: question.id,
    pillar: question.pillar,
    pillarLabel: (PILLAR_LABELS[track] || PILLAR_LABELS.ecom)[question.pillar],
    question: question.question,
    label: QUESTION_META[question.id]?.label || question.question,
    answerId: picks.length
      ? `${question.id}_${picks.map(letter).join("+")}`
      : null,
    answer: text,
    points,
    flag,
    symbol: FLAGS[flag],
    opener: QUESTION_META[question.id]?.opener || null,
    read: insight?.read || null,
    told: insight?.told || null,
    why: insight?.why || null,
  };
}

function scoreChannels(question, selected = []) {
  const picks = selected.map((i) => question.options[i]).filter(Boolean);
  const count = picks.length;

  if (count <= 1) return 0;
  if (count === 2) return 1;
  if (count === 3) return 2;

  if (question.id === "EC6") {
    return picks.some((p) => p.emailSms) ? 3 : 2;
  }
  const hasPaid = picks.some((p) => p.kind === "paid" || p.kind === "both");
  const hasOrganic = picks.some(
    (p) => p.kind === "organic" || p.kind === "both"
  );
  return hasPaid && hasOrganic ? 3 : 2;
}

export function scoreQuestion(question, answer) {
  if (question.multi) return scoreChannels(question, answer);
  return question.options[answer]?.points ?? 0;
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
 * answers: { H1, H2, H3, [questionId]: optionIndex | optionIndex[], Q1..Q5: optionIndex }
 */
export function computeResults(answers) {
  const track = answers.H1;
  const questions = questionsForTrack(track);
  const labels = PILLAR_LABELS[track] || PILLAR_LABELS.ecom;

  const records = questions.map((q) => recordAnswer(q, answers[q.id], track));

  const pillars = PILLARS.map((p, order) => {
    const own = records.filter((r) => r.pillar === p.key);
    const earned = own.reduce((sum, r) => sum + r.points, 0);
    const available = own.length * 3;
    return {
      key: p.key,
      label: labels[p.key],
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

  // Leak cards come only from pillars under 60. "You told us" lists every low
  // answer (the page shows two); "Why it matters" comes from the lowest one.
  const leaks = ranked
    .filter((p) => p.score < LEAK_MAX_SCORE)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      ...leakFor(p.key, track),
      told: p.lowAnswers.map((r) => r.told).filter(Boolean),
      why: p.lowAnswers[0]?.why ?? null,
    }));

  const fitScore = QUALIFICATION_QUESTIONS.reduce(
    (sum, q) => sum + (q.options[answers[q.id]]?.points ?? 0),
    0,
  );
  const fitBand = fitBandFor(fitScore);
  const role = QUALIFICATION_QUESTIONS.find((q) => q.key === "role")
    .options[answers.Q3]?.label;

  return {
    track,
    overall,
    tier: tierFor(overall),
    pillars,
    leaks,
    weakestPillar: ranked[0],
    answers: records,
    unsure: records.filter((r) => r.flag === "unsure"),
    // Opener from the single weakest answer in the whole quiz
    callOpener: [...records].sort(byWeakest)[0]?.opener ?? null,
    isDecisionMaker: DECISION_MAKER_ROLES.includes(role),
    fitScore,
    fitBand,
    hotLead: fitBand === "High" && overall < HOT_LEAD_MAX_SCORE,
  };
}

// Only the answer keys the quiz uses (drops anything else the client sent)
export function pickAnswers(answers) {
  const keys = [
    "H1",
    "H2",
    "H3",
    ...questionsForTrack(answers.H1).map((q) => q.id),
    ...QUALIFICATION_QUESTIONS.map((q) => q.id),
  ];
  return Object.fromEntries(
    keys.filter((k) => answers[k] !== undefined).map((k) => [k, answers[k]]),
  );
}
