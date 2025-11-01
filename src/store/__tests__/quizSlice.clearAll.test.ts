import reducer, { addQuestion, clearAll } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };

function baseState(partial?: Partial<QuizStoreState>): QuizStoreState {
  return { questions: [], history: [], hydrateError: null, ...partial };
}

describe("quizSlice/clearAll", () => {
  it("clears all questions and pushes a history snapshot when there were questions", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const s2 = reducer(s1, addQuestion({ type: "multiple" }));
    expect(s2.questions.length).toBe(2);

    const beforeHistoryLen = s2.history.length;
    const s3 = reducer(s2, clearAll());

    expect(s3.questions).toEqual([]);
    expect(s3.history.length).toBe(beforeHistoryLen + 1);
    expect(s3.history.at(-1)?.questions.length).toBe(2); // snapshot of pre-clear state
  });

  it("does not push history when already empty", () => {
    const empty = baseState();
    const s2 = reducer(empty, clearAll());

    expect(s2.questions).toEqual([]);
    expect(s2.history.length).toBe(0); // no snapshot because there was nothing to clear
  });
});
