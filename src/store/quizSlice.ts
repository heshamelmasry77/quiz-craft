import { createSlice } from "@reduxjs/toolkit";

type QuizState = { questionsCount: number };

const initialState: QuizState = { questionsCount: 0 };

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    // just a smoke action for now
    incrementQuestions(state) {
      state.questionsCount += 1;
    },
  },
});

export const { incrementQuestions } = quizSlice.actions;
export default quizSlice.reducer;
