import { z } from "zod";

export const OptionSchema = z.object({
  id: z.string(),
  text: z.string().trim().min(1, "Option text is required"), // text can be empty during editing; we validate at question level
  isCorrect: z.boolean(),
});

export const QuestionSchema = z
  .object({
    id: z.string(),
    type: z.enum(["single", "multiple", "short"]),
    title: z.string().trim().min(1, "Title is required"),
    options: z.array(OptionSchema),
  })
  .superRefine((q, ctx) => {
    // For choice questions, ensure ≥ 2 options and ≥ 1 correct
    if (q.type === "single" || q.type === "multiple") {
      if (q.options.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "At least 2 options are required",
          path: ["options"],
        });
      }
      const correctCount = q.options.filter((o) => o.isCorrect).length;
      if (correctCount < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Mark at least one option as correct",
          path: ["options"],
        });
      }
    }
    // For short text, we ignore options
  });

export const QuizSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type QuizValidationInput = z.infer<typeof QuizSchema>;
