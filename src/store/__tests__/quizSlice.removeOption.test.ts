import reducer, { addQuestion, addOption, removeOption } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };
const base = (p?: Partial<QuizStoreState>): QuizStoreState => ({
  questions: [],
  history: [],
  hydrateError: null,
  ...p,
});

describe("quizSlice/removeOption", () => {
  it("removes a specific option from a single-choice question and pushes history", () => {
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const q = s1.questions[0];

    // Add one more option so we can safely remove
    const s2 = reducer(s1, addOption({ questionId: q.id }));
    const optToRemove = s2.questions[0].options[0].id;
    const prevLen = s2.questions[0].options.length;
    const prevHist = s2.history.length;

    const s3 = reducer(s2, removeOption({ questionId: q.id, optionId: optToRemove }));

    expect(s3.questions[0].options.length).toBe(prevLen - 1);
    expect(s3.questions[0].options.find((o) => o.id === optToRemove)).toBeUndefined();
    expect(s3.history.length).toBe(prevHist + 1);
    expect(s3.history.at(-1)?.questions[0].options.length).toBe(prevLen);
  });

  it("works the same for multiple-choice questions", () => {
    const s1 = reducer(base(), addQuestion({ type: "multiple" }));
    const q = s1.questions[0];
    const optToRemove = q.options[0].id;

    const s2 = reducer(s1, removeOption({ questionId: q.id, optionId: optToRemove }));

    expect(s2.questions[0].options.find((o) => o.id === optToRemove)).toBeUndefined();
  });

  it("does nothing for short-text questions", () => {
    const s1 = reducer(base(), addQuestion({ type: "short" }));
    const q = s1.questions[0];
    const before = JSON.parse(JSON.stringify(s1));

    const s2 = reducer(s1, removeOption({ questionId: q.id, optionId: "something" }));
    expect(s2).toEqual(before);
  });
});
