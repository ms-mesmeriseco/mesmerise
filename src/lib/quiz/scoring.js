import {
  PILLARS,
  PILLAR_LABELS,
  TIERS,
  QUALIFICATION_QUESTIONS,
  questionsForTrack,
  leakFor,
} from "./quizData.js";

// Diagnostic scores below this, combined with high fit, are flagged for same-day outreach
export const HOT_LEAD_MAX_SCORE = 60;

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

  const earned = {};
  const available = {};
  for (const q of questions) {
    earned[q.pillar] = (earned[q.pillar] || 0) + scoreQuestion(q, answers[q.id]);
    available[q.pillar] = (available[q.pillar] || 0) + 3;
  }

  const pillars = PILLARS.map((p, order) => ({
    key: p.key,
    label: labels[p.key],
    weight: p.weight,
    order,
    score: available[p.key]
      ? Math.round((earned[p.key] / available[p.key]) * 100)
      : 0,
  }));

  const overall = Math.round(
    PILLARS.reduce(
      (sum, p) =>
        sum +
        p.weight *
          (available[p.key] ? (earned[p.key] / available[p.key]) * 100 : 0),
      0
    )
  );

  // Lowest first; ties go to the higher-weighted pillar, then pillar order
  const ranked = [...pillars].sort(
    (a, b) => a.score - b.score || b.weight - a.weight || a.order - b.order
  );
  const leaks = ranked.slice(0, 3).map((p) => ({
    ...p,
    ...leakFor(p.key, track),
  }));

  const fitScore = QUALIFICATION_QUESTIONS.reduce(
    (sum, q) => sum + (q.options[answers[q.id]]?.points ?? 0),
    0
  );
  const fitBand = fitBandFor(fitScore);

  return {
    track,
    overall,
    tier: tierFor(overall),
    pillars,
    leaks,
    weakestPillar: ranked[0],
    fitScore,
    fitBand,
    hotLead: fitBand === "High" && overall < HOT_LEAD_MAX_SCORE,
  };
}
