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

/**
 * Attempts to safely load the quiz state from the browser's localStorage.
 *
 * Returns an object with two properties:
 *   - `data`: The parsed QuizState if successfully loaded, or `null` if nothing is saved.
 *   - `error`: A human-readable message if the stored data is corrupt or cannot be parsed, or `null` if storage is unavailable or disabled.
 *
 * This function is intentionally defensive:
 *   • It checks that `window.localStorage` is available before accessing it
 *     (so it won't throw in non-browser environments).
 *   • It wraps all access in try/catch to avoid runtime crashes caused by malformed JSON.
 *   • It validates that the loaded object has a valid `questions` array
 *     before treating it as a quiz.
 *
 * Example result scenarios:
 *   { data: null, error: null }      → No quiz saved, or storage disabled.
 *   { data: validQuiz, error: null } → Successfully restored a quiz.
 *   { data: null, error: "Failed to read saved quiz (corrupt JSON)." } → JSON parse error.
 */
export function loadQuiz(): { data: QuizState | null; error: string | null } {
  // Verify that localStorage is available (prevents issues in SSR or incognito)
  if (!hasStorage()) return { data: null, error: null };

  try {
    // Retrieve the saved quiz JSON string from localStorage
    const raw = localStorage.getItem(KEY);

    // If nothing was stored previously, there’s nothing to load
    if (!raw) return { data: null, error: null };

    // Attempt to parse the stored JSON back into a QuizState object
    const parsed = JSON.parse(raw) as QuizState;

    // Basic sanity check: ensure the parsed object looks like a quiz
    if (!parsed || !Array.isArray(parsed.questions)) {
      return { data: null, error: "Saved data is invalid." };
    }

    // Successfully loaded and verified quiz data
    return { data: parsed, error: null };
  } catch {
    // Catch parsing or access errors — prevents app crashes
    return { data: null, error: "Failed to read saved quiz (corrupt JSON)." };
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
