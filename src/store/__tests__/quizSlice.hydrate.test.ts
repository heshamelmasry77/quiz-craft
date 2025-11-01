/**
 * Tests for persistence-related reducers: `hydrate` and `hydrateError`.
 *
 * - `hydrate(payload)` replaces the current quiz data with what's loaded from storage.
 *   Passing `null` means "nothing to load", so the state stays unchanged.
 * - `hydrateError(message)` saves an error message when loading fails.
 */

import reducer, { addQuestion, hydrate, hydrateError } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };

const base = (p?: Partial<QuizStoreState>): QuizStoreState => ({
  questions: [],
  history: [],
  hydrateError: null,
  ...p,
});

describe("quizSlice/hydrate + hydrateError", () => {
  it("does nothing when given null (nothing to hydrate)", () => {
    const s1 = base({ questions: [], history: [{ questions: [] }] });
    const s2 = reducer(s1, hydrate(null));
    expect(s2).toEqual(s1);
  });

  it("replaces questions with the loaded data and clears history + error", () => {
    // Start with some state containing a question, history, and an error
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const s1WithError: QuizStoreState = {
      ...s1,
      history: [{ questions: [] }],
      hydrateError: "previous error",
    };

    const payload: QuizState = {
      questions: [
        {
          id: "q1",
          type: "multiple",
          title: "Loaded question",
          options: [
            { id: "o1", text: "A", isCorrect: true },
            { id: "o2", text: "B", isCorrect: false },
          ],
        },
      ],
    };

    const s2 = reducer(s1WithError, hydrate(payload));

    // Replaces questions with the new data
    expect(s2.questions.length).toBe(1);
    expect(s2.questions[0].title).toBe("Loaded question");
    expect(s2.questions[0].type).toBe("multiple");

    // Clears history and previous error
    expect(s2.history.length).toBe(0);
    expect(s2.hydrateError).toBeNull();
  });

  it("saves an error message when hydrateError is called", () => {
    const s1 = base();
    const s2 = reducer(s1, hydrateError("Failed to parse saved quiz"));
    expect(s2.hydrateError).toBe("Failed to parse saved quiz");
  });

  it("clears the error when hydrate runs after hydrateError", () => {
    const s1 = reducer(base(), hydrateError("parse failed"));
    const s2 = reducer(s1, hydrate({ questions: [] }));
    expect(s2.hydrateError).toBeNull();
  });
});
