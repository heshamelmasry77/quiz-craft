import reducer, { addQuestion, updateQuestionTitle } from "../quizSlice";
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

describe("quizSlice/updateQuestionTitle", () => {
  it("updates the title of an existing question", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "single" }));
    const qId = s1.questions[0].id;

    const s2 = reducer(s1, updateQuestionTitle({ id: qId, title: "New title" }));

    expect(s2.questions[0].title).toBe("New title");
    expect(s2.questions[0].id).toBe(qId);
    expect(s2.questions.length).toBe(1);
  });

  it("does nothing if the question ID is not found", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "multiple" }));
    const before = JSON.parse(JSON.stringify(s1));

    const s2 = reducer(s1, updateQuestionTitle({ id: "nonexistent", title: "Should not change" }));

    expect(s2).toEqual(before);
  });

  it("does not push a history snapshot when updating title", () => {
    const s1 = reducer(baseState(), addQuestion({ type: "short" }));
    const qId = s1.questions[0].id;

    const s2 = reducer(s1, updateQuestionTitle({ id: qId, title: "Changed" }));

    expect(s2.history.length).toBe(s1.history.length);
  });
});
