import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ID, Question, QuestionType, QuizState } from "../types/quiz";

// Small helper for IDs creation
const makeId = () => crypto.randomUUID();

// Factory for a new blank question
const newQuestion = (type: QuestionType = "single"): Question => ({
  id: makeId(),
  type,
  title: "",
});

type QuizStoreState = QuizState & {
  // Simple undo buffer
  history: QuizState[];
};

const initialState: QuizStoreState = {
  questions: [],
  history: [],
};

function pushHistory(state: QuizStoreState) {
  state.history.push({ questions: JSON.parse(JSON.stringify(state.questions)) });
  if (state.history.length > 25) {
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
    updateQuestionTitle(state, action: PayloadAction<{ id: ID; title: string }>) {
      const q = state.questions.find((q) => q.id === action.payload.id);
      if (q) q.title = action.payload.title;
    },
    setQuestionType(state, action: PayloadAction<{ id: ID; type: QuestionType }>) {
      const q = state.questions.find((q) => q.id === action.payload.id);
      if (q) q.type = action.payload.type;
    },
    undo(state) {
      const prev = state.history.pop(); // Get last state from history
      if (prev) state.questions = prev.questions; // Restore questions
    },
    clearAll(state) {
      pushHistory(state);
      state.questions = [];
    },
  },
});

export const { addQuestion, removeQuestion, updateQuestionTitle, setQuestionType, undo, clearAll } =
  quizSlice.actions;

export default quizSlice.reducer;
