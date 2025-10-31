import { QuizSchema, type QuizValidationInput } from "../validation/quiz.schema";

/**
 * Represents a single validation error in the quiz.
 * - `path`: tells where the error happened (e.g. ["questions", 0, "title"])
 * - `message`: the human-readable explanation of the problem
 */
export type FieldError = { path: (string | number)[]; message: string };

/**
 * The overall result of validating a quiz.
 * - `ok: true` means the quiz passed all validation checks
 * - `ok: false` means the quiz has one or more issues
 */
export type QuizValidationResult = { ok: true } | { ok: false; errors: FieldError[] };

/**
 * Runs schema validation on a quiz object using Zod.
 * This function:
 *  1. Uses `QuizSchema` to validate the quiz structure and rules.
 *  2. Returns `{ ok: true }` if everything is valid.
 *  3. If invalid, collects all Zod issues into a simpler array of FieldErrors
 *     that the UI can use to highlight errors or show messages.
 */
export function validateQuiz(input: QuizValidationInput): QuizValidationResult {
  // Validate the quiz object against our Zod schema
  const res = QuizSchema.safeParse(input);

  // If valid, return a success result with no errors
  if (res.success) return { ok: true };

  // If invalid, extract each issue's path and message for the UI
  const errors: FieldError[] = res.error.issues.map((i) => ({
    path: i.path,
    message: i.message,
  }));

  // Return all errors in a unified structure
  return { ok: false, errors };
}
