import reducer, { addQuestion, setQuestionType } from "../quizSlice";
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

describe("quizSlice/setQuestionType", () => {
  it("switches from single → multiple keeps options", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const qId = s1.questions[0].id;

    const s2 = reducer(s1, setQuestionType({ id: qId, type: "multiple" }));

    expect(s2.questions[0].type).toBe("multiple");
    expect(s2.questions[0].options.length).toBeGreaterThanOrEqual(2);
  });

  it("switches to short removes all options", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const qId = s1.questions[0].id;

    const s2 = reducer(s1, setQuestionType({ id: qId, type: "short" }));

    expect(s2.questions[0].type).toBe("short");
    expect(s2.questions[0].options.length).toBe(0);
  });

  it("if options are fewer than 2 after switching, seeds new blank options", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "short" }));
    const qId = s1.questions[0].id;

    const s2 = reducer(s1, setQuestionType({ id: qId, type: "single" }));

    expect(s2.questions[0].options.length).toBeGreaterThanOrEqual(2);
    expect(s2.questions[0].options.every((o) => o.text === "" && !o.isCorrect)).toBe(true);
  });

  it("does nothing for unknown question ID", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "multiple" }));
    const s2 = reducer(s1, setQuestionType({ id: "unknown", type: "short" }));
    expect(s2).toEqual(s1);
  });
});
