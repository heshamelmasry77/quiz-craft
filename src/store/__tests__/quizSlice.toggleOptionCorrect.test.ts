import reducer, { addQuestion, toggleOptionCorrect } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };
const base = (p?: Partial<QuizStoreState>): QuizStoreState => ({
  questions: [],
  history: [],
  hydrateError: null,
  ...p,
});

describe("quizSlice/toggleOptionCorrect", () => {
  it("single-choice: selecting one marks it correct and clears others", () => {
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const q = s1.questions[0];
    const [a, b] = q.options;

    const s2 = reducer(s1, toggleOptionCorrect({ questionId: q.id, optionId: a.id }));
    expect(s2.questions[0].options.find((o) => o.id === a.id)?.isCorrect).toBe(true);
    expect(s2.questions[0].options.find((o) => o.id === b.id)?.isCorrect).toBe(false);

    const s3 = reducer(s2, toggleOptionCorrect({ questionId: q.id, optionId: b.id }));
    expect(s3.questions[0].options.find((o) => o.id === a.id)?.isCorrect).toBe(false);
    expect(s3.questions[0].options.find((o) => o.id === b.id)?.isCorrect).toBe(true);
  });

  it("multiple-choice: toggles independently", () => {
    const s1 = reducer(base(), addQuestion({ type: "multiple" }));
    const q = s1.questions[0];
    const [a, b] = q.options;

    const s2 = reducer(s1, toggleOptionCorrect({ questionId: q.id, optionId: a.id }));
    const s3 = reducer(s2, toggleOptionCorrect({ questionId: q.id, optionId: b.id }));

    expect(s3.questions[0].options.find((o) => o.id === a.id)?.isCorrect).toBe(true);
    expect(s3.questions[0].options.find((o) => o.id === b.id)?.isCorrect).toBe(true);

    const s4 = reducer(s3, toggleOptionCorrect({ questionId: q.id, optionId: a.id }));
    expect(s4.questions[0].options.find((o) => o.id === a.id)?.isCorrect).toBe(false);
    expect(s4.questions[0].options.find((o) => o.id === b.id)?.isCorrect).toBe(true);
  });

  it("short-text questions ignore toggling", () => {
    const s1 = reducer(base(), addQuestion({ type: "short" }));
    const q = s1.questions[0];

    // there are no options; ensure it doesn't throw and remains unchanged
    const s2 = reducer(s1, toggleOptionCorrect({ questionId: q.id, optionId: "any" }));
    expect(s2).toEqual(s1);
  });

  it("does not push history on toggle", () => {
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const q = s1.questions[0];
    const id = q.options[0].id;

    const s2 = reducer(s1, toggleOptionCorrect({ questionId: q.id, optionId: id }));
    expect(s2.history.length).toBe(s1.history.length);
  });
});
