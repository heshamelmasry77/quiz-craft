import reducer, { addQuestion, removeQuestion } from "../quizSlice";
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

describe("quizSlice/removeQuestion", () => {
  it("removes a question by id and pushes history", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const s2 = reducer(s1, addQuestion({ type: "multiple" }));

    const idToRemove = s2.questions[0].id;
    const prevLen = s2.questions.length;

    const s3 = reducer(s2, removeQuestion(idToRemove));

    expect(s3.questions.length).toBe(prevLen - 1);
    expect(s3.questions.find((q) => q.id === idToRemove)).toBeUndefined();

    expect(s3.history.length).toBe(s2.history.length + 1);
    expect(s3.history.at(-1)?.questions.length).toBe(prevLen); // snapshot before removal
  });

  it("no-op removal (unknown id) still pushes history snapshot", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const before = { ...s1, questions: [...s1.questions], history: [...s1.history] };

    const s2 = reducer(s1, removeQuestion("non-existent-id"));

    // state remains same
    expect(s2.questions.length).toBe(before.questions.length);
    expect(s2.questions[0].id).toBe(before.questions[0].id);

    // history still gets a snapshot per current reducer behavior
    expect(s2.history.length).toBe(before.history.length + 1);
    expect(s2.history.at(-1)?.questions.length).toBe(before.questions.length);
  });

  it("removing from empty state is safe and records a snapshot", () => {
    const empty = baseState();
    const s2 = reducer(empty, removeQuestion("whatever"));

    expect(s2.questions.length).toBe(0);
    expect(s2.history.length).toBe(1); // snapshot of empty array
    expect(s2.history[0].questions).toEqual([]);
  });
});
