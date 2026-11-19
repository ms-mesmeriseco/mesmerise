// Saved quiz progress, so someone who leaves partway picks up where they
// stopped in the same browser. Storage can be missing or blocked (private
// windows, cleared site data), so every call fails quietly.
// Bump the version when options are reordered, so old saved indexes are dropped
const KEY = "mesm-cmo-benchmark-v2";

// { stepIndex, answers, quizStarted } or null. quizStarted: this attempt's
// QuizStart event was sent (missing on progress saved before tracking)
export function loadProgress() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY));
    if (!saved || typeof saved.stepIndex !== "number" || !saved.answers) {
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

export function saveProgress(stepIndex, answers, quizStarted) {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ stepIndex, answers, quizStarted }),
    );
  } catch {}
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}
