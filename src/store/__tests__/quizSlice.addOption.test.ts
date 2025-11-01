import reducer, { addQuestion, addOption } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };
const base = (p?: Partial<QuizStoreState>): QuizStoreState => ({
  questions: [],
  history: [],
  hydrateError: null,
  ...p,
});

describe("quizSlice/addOption", () => {
  it("adds a new blank option to a single-choice question and pushes history", () => {
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const q = s1.questions[0];
    const prevLen = q.options.length;
    const prevHist = s1.history.length;

    const s2 = reducer(s1, addOption({ questionId: q.id }));

    expect(s2.questions[0].options.length).toBe(prevLen + 1);
    const newOpt = s2.questions[0].options.at(-1)!;
    expect(newOpt.text).toBe("");
    expect(newOpt.isCorrect).toBe(false);
    expect(s2.history.length).toBe(prevHist + 1);
    expect(s2.history.at(-1)?.questions[0].options.length).toBe(prevLen);
  });

  it("adds a new blank option to a multiple-choice question", () => {
    const s1 = reducer(base(), addQuestion({ type: "multiple" }));
    const q = s1.questions[0];
    const s2 = reducer(s1, addOption({ questionId: q.id }));

    expect(s2.questions[0].options.length).toBe(q.options.length + 1);
  });

  it("does nothing for short-text questions", () => {
    const s1 = reducer(base(), addQuestion({ type: "short" }));
    const before = JSON.parse(JSON.stringify(s1));
    const s2 = reducer(s1, addOption({ questionId: s1.questions[0].id }));
    expect(s2).toEqual(before);
  });
});
