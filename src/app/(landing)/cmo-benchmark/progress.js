// Saved quiz progress, so someone who leaves partway picks up where they
// stopped in the same browser. Storage can be missing or blocked (private
// windows, cleared site data), so every call fails quietly.
const KEY = "mesm-cmo-benchmark-v1";

// { stepIndex, answers } or null
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

export function saveProgress(stepIndex, answers) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ stepIndex, answers }));
  } catch {}
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}
