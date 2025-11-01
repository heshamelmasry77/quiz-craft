import reducer, { addQuestion, removeQuestion, undo } from "../quizSlice";
import type { QuizState } from "../../types/quiz";

type QuizStoreState = QuizState & { history: QuizState[]; hydrateError: string | null };
const base = (p?: Partial<QuizStoreState>): QuizStoreState => ({
  questions: [],
  history: [],
  hydrateError: null,
  ...p,
});

describe("quizSlice/undo", () => {
  it("reverts to the previous snapshot in history", () => {
    const s1 = reducer(base(), addQuestion({ type: "single" }));
    const s2 = reducer(s1, addQuestion({ type: "multiple" }));
    const s3 = reducer(s2, removeQuestion(s2.questions[0].id));

    expect(s3.questions.length).toBe(1);
    expect(s3.history.length).toBeGreaterThan(0);

    const s4 = reducer(s3, undo());

    // Undo should restore questions from the last history entry
    expect(s4.questions.length).toBe(2);
    expect(s4.history.length).toBe(s3.history.length - 1);
  });

  it("does nothing if there is no history", () => {
    const empty = base();
    const s2 = reducer(empty, undo());
    expect(s2).toEqual(empty);
  });

  it("only restores one step at a time", () => {
    let s = reducer(base(), addQuestion({ type: "single" }));
    s = reducer(s, addQuestion({ type: "multiple" }));
    s = reducer(s, addQuestion({ type: "short" }));

    const totalHistory = s.history.length;
    const sUndo1 = reducer(s, undo());
    expect(sUndo1.questions.length).toBe(2);
    expect(sUndo1.history.length).toBe(totalHistory - 1);

    const sUndo2 = reducer(sUndo1, undo());
    expect(sUndo2.questions.length).toBe(1);
    expect(sUndo2.history.length).toBe(totalHistory - 2);
  });
});
