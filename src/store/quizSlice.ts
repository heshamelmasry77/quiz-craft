import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ID, Question, QuestionType, QuizState, Option } from "../types/quiz";

// Small helper for IDs creation
const makeId = () => crypto.randomUUID();

const blankOptions = (): Option[] => [
  { id: makeId(), text: "", isCorrect: false },
  { id: makeId(), text: "", isCorrect: false },
];

const newQuestion = (type: QuestionType = "single"): Question => ({
  id: makeId(),
  type,
  title: "",
  options: type === "short" ? [] : blankOptions(),
});

type QuizStoreState = QuizState & { history: QuizState[] };

const initialState: QuizStoreState = { questions: [], history: [] };

function pushHistory(state: QuizStoreState) {
  state.history.push({ questions: JSON.parse(JSON.stringify(state.questions)) });
  if (state.history.length > 25) {
    // limit history size
    state.history.shift();
  }
}

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    addQuestion(state, action: PayloadAction<{ type?: QuestionType } | undefined>) {
      pushHistory(state);
      state.questions.push(newQuestion(action.payload?.type ?? "single"));
    },
    removeQuestion(state, action: PayloadAction<ID>) {
      pushHistory(state);
      state.questions = state.questions.filter((q) => q.id !== action.payload);
    },
    clearAll(state) {
      if (state.questions.length) pushHistory(state);
      state.questions = [];
    },

    updateQuestionTitle(state, action: PayloadAction<{ id: ID; title: string }>) {
      const q = state.questions.find((q) => q.id === action.payload.id);
      if (q) q.title = action.payload.title;
    },
    // ensure options array shape when switching type
    setQuestionType(state, action: PayloadAction<{ id: ID; type: QuestionType }>) {
      const q = state.questions.find((q) => q.id === action.payload.id);
      if (!q) return;
      q.type = action.payload.type;
      if (q.type === "short") q.options = [];
      else if (q.options.length < 2) q.options = blankOptions();
    },

    // ===== Options Management =====

    addOption(state, action: PayloadAction<{ questionId: ID }>) {
      const q = state.questions.find((q) => q.id === action.payload.questionId);
      if (!q || q.type === "short") return; // no options
      pushHistory(state);
      q.options.push({ id: makeId(), text: "", isCorrect: false }); // new blank option for multiple/single choice
    },

    removeOption(state, action: PayloadAction<{ questionId: ID; optionId: ID }>) {
      const q = state.questions.find((q) => q.id === action.payload.questionId);
      if (!q || q.type === "short") return;
      pushHistory(state);
      q.options = q.options.filter((o) => o.id !== action.payload.optionId);
    },

    updateOptionText(state, action: PayloadAction<{ questionId: ID; optionId: ID; text: string }>) {
      const q = state.questions.find((q) => q.id === action.payload.questionId);
      const o = q?.options.find((o) => o.id === action.payload.optionId);
      if (o) o.text = action.payload.text;
    },

    // (toggling a boolean)
    toggleOptionCorrect(state, action: PayloadAction<{ questionId: ID; optionId: ID }>) {
      const q = state.questions.find((q) => q.id === action.payload.questionId);
      if (!q || q.type === "short") return; // no options

      if (q.type === "single") {
        // single choice
        const target = action.payload.optionId;
        q.options = q.options.map((o) => ({
          ...o,
          isCorrect: o.id === target ? !o.isCorrect : false,
        }));
      } else {
        const o = q.options.find((o) => o.id === action.payload.optionId);
        if (o) o.isCorrect = !o.isCorrect; // multiple
      }
    },

    undo(state) {
      const prev = state.history.pop();
      if (prev) state.questions = prev.questions;
    },
    hydrate(state, action: PayloadAction<QuizState | null>) {
      // simply replaces the current quiz list with the one loaded from storage.
      // If nothing was saved, do nothing.
      if (!action.payload) {
        return;
      }

      // Replace state with the loaded quiz
      state.questions = action.payload.questions ?? [];

      // Reset undo stack since this is a new session
      state.history = [];
    },
  },
});

export const {
  addQuestion,
  removeQuestion,
  clearAll,
  updateQuestionTitle,
  setQuestionType,
  addOption,
  removeOption,
  updateOptionText,
  toggleOptionCorrect,
  undo,
  hydrate,
} = quizSlice.actions;

export default quizSlice.reducer;
