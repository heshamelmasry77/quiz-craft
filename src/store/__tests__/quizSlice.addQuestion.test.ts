import reducer, { addQuestion } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };

function baseState(partial?: Partial<QuizStoreState>): QuizStoreState {
  return {
    questions: [],
    history: [],
    hydrateError: null,
    ...partial,
  };
}

describe("quizSlice/addQuestion", () => {
  it("adds a single-choice question by default and pushes history", () => {
    const prev = baseState();
    const next = reducer(prev, addQuestion(undefined));

    expect(next.questions.length).toBe(1);
    const q = next.questions[0];
    expect(q.type).toBe("single");
    expect(q.title).toBe("");
    expect(Array.isArray(q.options)).toBe(true);
    expect(q.options.length).toBeGreaterThanOrEqual(2); // blankOptions() seeds 2
    expect(next.history.length).toBe(1); // snapshot of previous state pushed
    expect(next.history[0].questions).toEqual([]); // previous questions
  });

  it("adds a multiple-choice question with seeded blank options", () => {
    const prev = baseState();
    const next = reducer(prev, addQuestion({ type: "multiple" }));

    const q = next.questions[0];
    expect(q.type).toBe("multiple");
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(q.options.every((o) => o.text === "" && o.isCorrect === false)).toBe(true);
  });

  it("adds a short-text question with no options", () => {
    const prev = baseState();
    const next = reducer(prev, addQuestion({ type: "short" }));

    const q = next.questions[0];
    expect(q.type).toBe("short");
    expect(q.options.length).toBe(0);
  });

  it("appends to existing questions and pushes history each time", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const s2 = reducer(s1, addQuestion({ type: "short" }));

    expect(s2.questions.length).toBe(2);
    expect(s2.history.length).toBe(2); // one snapshot per add
    expect(s2.history[0].questions.length).toBe(0); // before first add
    expect(s2.history[1].questions.length).toBe(1); // before second add
  });
});
