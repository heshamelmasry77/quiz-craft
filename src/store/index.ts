import { configureStore } from "@reduxjs/toolkit";
import quizReducer, { hydrate } from "./quizSlice";
import { debounce } from "../lib/debounce";
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

// Debounced auto-save to localStorage to reduce I/O overhead
// Waits 500ms after the last state change before saving
const debouncedSave = debounce(() => {
  const state = store.getState();
  const payload = { questions: state.quiz.questions };
  saveQuiz(payload);
}, 500);

store.subscribe(() => {
  debouncedSave();
});

// Typed helpers for selectors and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
