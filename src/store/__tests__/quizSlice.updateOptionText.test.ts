import reducer, { addQuestion, updateOptionText } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };

const base = (p?: Partial<QuizStoreState>): QuizStoreState => ({
  questions: [],
  history: [],
  hydrateError: null,
  ...p,
});

describe("quizSlice/updateOptionText", () => {
  it("updates the text of the correct option", () => {
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const q = s1.questions[0];
    const optionId = q.options[0].id;

    const s2 = reducer(
      s1,
      updateOptionText({ questionId: q.id, optionId, text: "Updated option" }),
    );

    const updated = s2.questions[0].options.find((o) => o.id === optionId);
    expect(updated?.text).toBe("Updated option");
  });

  it("does nothing if the question id is invalid", () => {
    const s1 = reducer(base(), addQuestion({ type: "multiple" }));
    const before = JSON.parse(JSON.stringify(s1));

    const s2 = reducer(
      s1,
      updateOptionText({ questionId: "not-found", optionId: "any", text: "No change" }),
    );

    expect(s2).toEqual(before);
  });
});
