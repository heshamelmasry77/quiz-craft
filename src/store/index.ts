import { configureStore } from "@reduxjs/toolkit";
import quizReducer, { hydrate, hydrateError } from "./quizSlice";
import loaderReducer, { showLoader, hideLoader } from "./loaderSlice";
import { loadQuiz, saveQuiz } from "../lib/storage";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    loader: loaderReducer,
  },
});

// Show loader during hydrate
store.dispatch(showLoader("Loading saved quiz…"));

const { data, error } = loadQuiz();
if (error) {
  store.dispatch(hydrateError(error));
} else {
  // Re-hydrate state from localStorage once on startup
  store.dispatch(hydrate(data)); // data may be null: either nothing saved OR storage is disabled
}

// small delay before hiding loader (smooth UX)
setTimeout(() => {
  store.dispatch(hideLoader());
}, 200);

// Lightweight auto-save to localStorage whenever state changes
store.subscribe(() => {
  const state = store.getState();
  const payload = { questions: state.quiz.questions };
  saveQuiz(payload);
});

// Typed helpers for selectors and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
