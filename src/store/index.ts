import { configureStore } from "@reduxjs/toolkit";
import quizReducer, { hydrate } from "./quizSlice";
import { loadQuiz, saveQuiz } from "../lib/storage";

// Configure a single Redux store for the app
export const store = configureStore({
  reducer: { quiz: quizReducer },
});

// Re-hydrate state from localStorage once on startup
const persisted = loadQuiz();
if (persisted) {
  store.dispatch(hydrate(persisted));
}

// Lightweight auto-save to localStorage whenever state changes
store.subscribe(() => {
  const state = store.getState();
  const payload = { questions: state.quiz.questions };
  saveQuiz(payload);
});

// Typed helpers for selectors and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
