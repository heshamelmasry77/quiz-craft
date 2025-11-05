import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

// Simple answer types
type SingleAnswer = { kind: "single"; selectedOptionId: string | null };
type MultipleAnswer = { kind: "multiple"; selectedOptionIds: Record<string, true> };
type ShortAnswer = { kind: "short"; text: string };
type AnyAnswer = SingleAnswer | MultipleAnswer | ShortAnswer;

// Utility helpers
function isAutoGradable(type: string) {
  return type === "single" || type === "multiple";
}

function getCorrectOptionIds(q: { options: { id: string; isCorrect?: boolean }[] }) {
  const ids: Record<string, true> = {};
  for (const option of q.options) {
    if (option.isCorrect) {
      ids[option.id] = true;
    }
  }
  return ids;
}

function isCorrectSingle(user: SingleAnswer, correct: Record<string, true>) {
  if (user.selectedOptionId && correct[user.selectedOptionId]) {
    return true;
  } else {
    return false;
  }
}

function isCorrectMultiple(user: MultipleAnswer, correct: Record<string, true>) {
  const userKeys = Object.keys(user.selectedOptionIds);
  const correctKeys = Object.keys(correct);

  if (userKeys.length !== correctKeys.length) {
    return false;
  } else {
    const allMatch = userKeys.every((id) => correct[id]);
    return allMatch;
  }
}

export default function PreviewPage() {
  const navigate = useNavigate();
  const questions = useAppSelector((s) => s.quiz.questions);

  const [answers, setAnswers] = useState<Record<string, AnyAnswer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  // Initialize answers when questions change
  useEffect(() => {
    const initialAnswers: Record<string, AnyAnswer> = {};

    for (const q of questions) {
      if (q.type === "single") {
        initialAnswers[q.id] = { kind: "single", selectedOptionId: null };
      } else if (q.type === "multiple") {
        initialAnswers[q.id] = { kind: "multiple", selectedOptionIds: {} };
      } else {
        initialAnswers[q.id] = { kind: "short", text: "" };
      }
    }

    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(null);
  }, [questions]);

  function chooseSingle(qId: string, optionId: string) {
    if (submitted) {
      return;
    } else {
      setAnswers((prev) => {
        return { ...prev, [qId]: { kind: "single", selectedOptionId: optionId } };
      });
    }
  }

  function toggleMultiple(qId: string, optionId: string) {
    if (submitted) {
      return;
    } else {
      setAnswers((prev) => {
        const current = prev[qId] as MultipleAnswer;
        const next = { ...current.selectedOptionIds };

        if (next[optionId]) {
          delete next[optionId];
        } else {
          next[optionId] = true;
        }

        return { ...prev, [qId]: { kind: "multiple", selectedOptionIds: next } };
      });
    }
  }

  function typeShort(qId: string, text: string) {
    if (submitted) {
      return;
    } else {
      setAnswers((prev) => {
        return { ...prev, [qId]: { kind: "short", text } };
      });
    }
  }

  function resetAnswers() {
    const reset: Record<string, AnyAnswer> = {};

    for (const q of questions) {
      if (q.type === "single") {
        reset[q.id] = { kind: "single", selectedOptionId: null };
      } else if (q.type === "multiple") {
        reset[q.id] = { kind: "multiple", selectedOptionIds: {} };
      } else {
        reset[q.id] = { kind: "short", text: "" };
      }
    }

    setAnswers(reset);
    setSubmitted(false);
    setScore(null);
  }

  function submitAndScore() {
    if (submitted) {
      return;
    } else {
      let correct = 0;
      let total = 0;

      for (const q of questions) {
        if (isAutoGradable(q.type)) {
          total += 1;
          const correctIds = getCorrectOptionIds(q);
          const user = answers[q.id];

          if (q.type === "single" && user?.kind === "single") {
            if (isCorrectSingle(user, correctIds)) {
              correct += 1;
            }
          } else if (q.type === "multiple" && user?.kind === "multiple") {
            if (isCorrectMultiple(user, correctIds)) {
              correct += 1;
            }
          }
        }
      }

      setScore({ correct, total });
      setSubmitted(true);
    }
  }

  function renderShort(qId: string) {
    const value = answers[qId]?.kind === "short" ? (answers[qId] as ShortAnswer).text : "";

    return (
      <div className="mt-3">
        <label className="text-sm" htmlFor={`short-${qId}`}>
          Your answer
        </label>
        <input
          id={`short-${qId}`}
          className="mt-1 w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your answer…"
          value={value}
          onChange={(e) => typeShort(qId, e.target.value)}
          disabled={submitted}
        />
      </div>
    );
  }

  function renderChoices(
    qId: string,
    type: "single" | "multiple",
    options: { id: string; text: string; isCorrect: boolean }[],
  ) {
    const user = answers[qId];
    const correctIds = submitted ? getCorrectOptionIds({ options }) : null;

    return (
      <fieldset className="mt-3">
        <legend className="sr-only">Choose answer{type === "multiple" ? "s" : ""}</legend>
        <ul className="space-y-2">
          {options.map((o) => {
            let checked = false;

            if (type === "single") {
              if (user?.kind === "single" && user.selectedOptionId === o.id) {
                checked = true;
              }
            } else if (type === "multiple") {
              if (user?.kind === "multiple" && user.selectedOptionIds[o.id]) {
                checked = true;
              }
            }

            let feedback = null;
            if (submitted && correctIds) {
              if (o.isCorrect) {
                feedback = (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">
                    Correct
                  </span>
                );
              } else {
                feedback = (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    Option
                  </span>
                );
              }
            }

            return (
              <li key={o.id} className="flex items-center gap-3">
                {type === "single" && (
                  <input
                    type="radio"
                    name={`q-${qId}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={checked}
                    onChange={() => chooseSingle(qId, o.id)}
                    disabled={submitted}
                  />
                )}

                {type === "multiple" && (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={checked}
                    onChange={() => toggleMultiple(qId, o.id)}
                    disabled={submitted}
                  />
                )}

                <span>{o.text || <em className="text-gray-500">Empty option</em>}</span>
                {feedback}
              </li>
            );
          })}
        </ul>
      </fieldset>
    );
  }

  return (
    <section aria-label="Student preview" className="space-y-5">
      <PageHeader
        title="Quiz Preview"
        actions={
          <div className="flex gap-2">
            <Button variant="neutral" onClick={resetAnswers}>
              Reset answers
            </Button>

            <Button
              variant="primary"
              onClick={submitAndScore}
              disabled={submitted}
              className={submitted ? "opacity-50 cursor-not-allowed" : ""}
            >
              {submitted ? "Submitted" : "Submit"}
            </Button>

            <Button variant="neutral" onClick={() => navigate("/")}>
              ← Back to Builder
            </Button>
          </div>
        }
      />

      {score && (
        <div
          role="status"
          aria-live="polite"
          className="border rounded-md p-3 bg-blue-50 text-blue-800"
        >
          <span className="font-medium">Score:</span> {score.correct} / {score.total}
          {score.total === 0 && <span className="ml-2 text-sm"> (no auto-graded questions)</span>}
        </div>
      )}

      {questions.length === 0 && <p className="text-gray-600">No questions available.</p>}

      {questions.length > 0 && (
        <ol data-testid="preview-list" className="space-y-6">
          {questions.map((q, index) => {
            return (
              <li
                key={q.id}
                aria-label={`question-${index + 1}`}
                className="border rounded-lg p-5 bg-white shadow-sm transition-shadow hover:shadow"
              >
                <p className="font-medium">
                  {index + 1}. {q.title || <em className="text-gray-500">Untitled</em>}
                </p>

                {q.type === "short" && renderShort(q.id)}
                {q.type === "single" && renderChoices(q.id, "single", q.options)}
                {q.type === "multiple" && renderChoices(q.id, "multiple", q.options)}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
