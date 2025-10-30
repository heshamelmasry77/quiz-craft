// Core domain types for the quiz builder.

export type ID = string;

export type QuestionType = "single" | "multiple" | "short";

export interface Option {
  id: ID;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: ID;
  type: QuestionType;
  title: string;
  options: Option[]; // empty for "short"
}

export interface QuizState {
  questions: Question[];
}
