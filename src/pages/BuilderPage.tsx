import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { openConfirm } from "../store/modalSlice";
import {
  addQuestion,
  removeQuestion,
  undo,
  setQuestionType,
  updateQuestionTitle,
  duplicateQuestion,
  addOption,
  removeOption,
  updateOptionText,
  toggleOptionCorrect,
} from "../store/quizSlice";
import type { QuestionType } from "../types/quiz";
import { validateQuiz, type FieldError } from "../lib/validateQuiz";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

export default function BuilderPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const questions = useAppSelector((s) => s.quiz.questions);
  const [errors, setErrors] = useState<FieldError[] | null>(null);

  const addQ = (type: QuestionType) => dispatch(addQuestion({ type }));

  const onPreview = () => {
    const result = validateQuiz({ questions });
    if (result.ok) {
      setErrors(null);
      navigate("/preview");
    } else {
      setErrors(result.errors);
      document.getElementById("builder-top")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const questionErrors = (qid: string) =>
    (errors ?? []).filter(
      (e) => e.path[0] === "questions" && e.path[1] === questions.findIndex((q) => q.id === qid),
    );

  return (
    <section id="builder-top" className="space-y-5">
      <PageHeader
        title="Accessible Quiz Builder"
        actions={
          <>
            <Button variant="primary" onClick={onPreview} data-testid="preview">
              Preview Quiz →
            </Button>
            <Button variant="neutral" onClick={() => dispatch(undo())}>
              Undo
            </Button>
            <Button
              variant="danger"
              data-testid="clear-quiz"
              onClick={() =>
                dispatch(
                  openConfirm({
                    title: "Clear quiz?",
                    message:
                      "Are you sure you want to clear the whole quiz? This cannot be undone.",
                    confirmText: "Clear quiz",
                    cancelText: "Cancel",
                    action: { type: "clear-quiz" },
                  }),
                )
              }
            >
              Clear quiz
            </Button>
          </>
        }
      />

      {errors && errors.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="border border-red-200 rounded-md p-4 bg-red-50 text-red-700"
        >
          <p className="font-medium mb-2">Please fix the highlighted issues before preview.</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {errors.slice(0, 5).map((e, idx) => (
              <li key={idx}>{e.message}</li>
            ))}
            {errors.length > 5 && <li>…and more</li>}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button data-testid="add-single" onClick={() => addQ("single")}>
          + Single choice
        </Button>
        <Button data-testid="add-multiple" onClick={() => addQ("multiple")}>
          + Multiple choice
        </Button>
        <Button data-testid="add-short" onClick={() => addQ("short")}>
          + Short text
        </Button>
      </div>

      {questions.length === 0 && (
        <p className="text-gray-600">No questions yet. Use the buttons above to add one.</p>
      )}

      <ol className="space-y-6">
        {questions.map((q, idx) => {
          const qErrs = questionErrors(q.id);
          const titleError = qErrs.find((e) => e.path.includes("title"));
          const optionsError = qErrs.find((e) => e.path.includes("options"));

          return (
            <li
              key={q.id}
              className="border rounded-lg p-5 bg-white shadow-sm transition-shadow hover:shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Q{idx + 1}</span>

                {/* Question type dropdown */}
                <label htmlFor={`type-${q.id}`} className="sr-only">
                  Question type
                </label>
                <select
                  id={`type-${q.id}`}
                  name={`type-${q.id}`}
                  aria-label="Question type"
                  className="h-[38px] border rounded-md px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={q.type}
                  onChange={(e) =>
                    dispatch(setQuestionType({ id: q.id, type: e.target.value as QuestionType }))
                  }
                >
                  <option value="single">Single choice</option>
                  <option value="multiple">Multiple choice</option>
                  <option value="short">Short text</option>
                </select>

                <Button
                  variant="danger"
                  size="sm"
                  className="ml-auto"
                  onClick={() => dispatch(removeQuestion(q.id))}
                >
                  Remove
                </Button>
                <Button
                  variant="neutral"
                  size="sm"
                  data-testid={`duplicate-${q.id}`}
                  onClick={() => dispatch(duplicateQuestion({ id: q.id }))}
                >
                  Duplicate
                </Button>

                <Button variant="danger" size="sm" onClick={() => dispatch(removeQuestion(q.id))}>
                  Remove
                </Button>
              </div>

              {/* Question title input */}
              <label htmlFor={`title-${q.id}`} className="block mt-4 text-sm text-gray-700">
                Question title
              </label>
              <input
                id={`title-${q.id}`}
                name={`title-${q.id}`}
                placeholder="Enter your question here..."
                className={`h-[38px] mt-1 border rounded-md px-3 w-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  titleError ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={!!titleError}
                value={q.title}
                onChange={(e) => dispatch(updateQuestionTitle({ id: q.id, title: e.target.value }))}
              />
              {titleError && <p className="mt-1 text-xs text-red-600">{titleError.message}</p>}

              {/* Options */}
              {q.type !== "short" && (
                <fieldset className="mt-5">
                  <legend className="font-medium text-gray-900">Options</legend>

                  <div className="flex items-center justify-between mt-2">
                    <div />
                    <Button
                      variant="neutral"
                      onClick={() => dispatch(addOption({ questionId: q.id }))}
                    >
                      + Add option
                    </Button>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {q.options.map((o) => (
                      <li key={o.id} className="flex items-center gap-3">
                        <input
                          aria-label="Mark correct"
                          type={q.type === "single" ? "radio" : "checkbox"}
                          name={q.type === "single" ? `q-${q.id}` : undefined}
                          checked={!!o.isCorrect}
                          onChange={() =>
                            dispatch(toggleOptionCorrect({ questionId: q.id, optionId: o.id }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />

                        {/* Option text input */}
                        <input
                          aria-label="Option text"
                          id={`option-${q.id}-${o.id}`}
                          name={`option-${q.id}-${o.id}`}
                          placeholder="Type option text..."
                          className="h-[38px] flex-1 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={o.text}
                          onChange={(e) =>
                            dispatch(
                              updateOptionText({
                                questionId: q.id,
                                optionId: o.id,
                                text: e.target.value,
                              }),
                            )
                          }
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          aria-label={`Remove option ${o.text || "untitled"}`}
                          onClick={() =>
                            dispatch(removeOption({ questionId: q.id, optionId: o.id }))
                          }
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>

                  {optionsError && (
                    <p className="mt-2 text-xs text-red-600">{optionsError.message}</p>
                  )}
                </fieldset>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
