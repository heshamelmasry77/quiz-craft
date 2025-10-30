import type { QuizState } from "../types/quiz";

const KEY = "quizcraft:quiz";

/** Is localStorage available (e.g. not blocked)? */
// safety check
function hasStorage() {
  try {
    //    If there is no `window` object,
    //    we immediately return false — we’re not in a browser yet.
    if (typeof window === "undefined") return false;

    //    Try writing and deleting a tiny test key.
    //    If the browser allows this, localStorage is usable.
    const k = "__t";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);

    //  If no error happened, storage works.
    return true;
  } catch {
    //    If any step threw (e.g. “Access denied”),
    //    we return false instead of crashing.
    return false;
  }
}

export function loadQuiz(): QuizState | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuizState;
    // Very light shape check
    if (!parsed || !Array.isArray(parsed.questions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveQuiz(state: QuizState) {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota/serialization errors
  }
}

export function clearQuizStorage() {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch (err) {
    console.warn("Failed to clear quiz storage:", err);
  }
}
