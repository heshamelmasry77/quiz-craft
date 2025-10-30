// Core domain types for the quiz builder.

export type ID = string;

export type QuestionType = "single" | "multiple" | "short";

export interface Question {
  id: ID;
  type: QuestionType;
  title: string;
}

export interface QuizState {
  questions: Question[];
}
