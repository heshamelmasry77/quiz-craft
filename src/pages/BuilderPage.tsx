import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addQuestion,
  removeQuestion,
  clearAll,
  undo,
  setQuestionType,
  updateQuestionTitle,
  addOption,
  removeOption,
  updateOptionText,
  toggleOptionCorrect,
} from "../store/quizSlice";
import type { QuestionType } from "../types/quiz";
import { clearQuizStorage } from "../lib/storage";
import { useNavigate } from "react-router-dom";

export default function BuilderPage() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.quiz.questions);
  const navigate = useNavigate();

  const addQ = (type: QuestionType) => dispatch(addQuestion({ type }));

  return (
    <section id="top" className="space-y-4">
      <header className="flex flex-wrap gap-2 items-center">
        <h1 className="text-xl font-semibold mr-auto">Accessible Quiz Builder</h1>
        <button
          className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
          onClick={() => navigate("/preview")}
        >
          Preview Quiz →
        </button>
        <button
          className="px-3 py-2 border rounded cursor-pointer"
          onClick={() => dispatch(undo())}
        >
          Undo
        </button>
        <button
          className="px-3 py-2 border rounded cursor-pointer"
          onClick={() => {
            dispatch(clearAll());
            clearQuizStorage();
          }}
        >
          Clear quiz
        </button>
      </header>

      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded cursor-pointer" onClick={() => addQ("single")}>
          + Single choice
        </button>
        <button
          className="px-3 py-2 border rounded cursor-pointer"
          onClick={() => addQ("multiple")}
        >
          + Multiple choice
        </button>
        <button className="px-3 py-2 border rounded cursor-pointer" onClick={() => addQ("short")}>
          + Short text
        </button>
      </div>

      {questions.length === 0 && (
        <p className="text-gray-600">No questions yet. Use the buttons above to add one.</p>
      )}

      <ol className="space-y-6">
        {questions.map((q, idx) => (
          <li key={q.id} className="border rounded p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Q{idx + 1}</span>

              <select
                aria-label="Question type"
                className="border rounded px-2 py-1"
                value={q.type}
                onChange={(e) =>
                  dispatch(setQuestionType({ id: q.id, type: e.target.value as QuestionType }))
                }
              >
                <option value="single">Single choice</option>
                <option value="multiple">Multiple choice</option>
                <option value="short">Short text</option>
              </select>

              <button
                className="ml-auto px-2 py-1 border rounded text-red-600 cursor-pointer"
                onClick={() => dispatch(removeQuestion(q.id))}
              >
                Remove
              </button>
            </div>

            <label className="block mt-3 text-sm">
              Question title
              <input
                className="mt-1 w-full border rounded px-2 py-2"
                value={q.title}
                onChange={(e) => dispatch(updateQuestionTitle({ id: q.id, title: e.target.value }))}
              />
            </label>

            {q.type !== "short" && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Options</h3>
                  <button
                    className="px-2 py-1 border rounded cursor-pointer"
                    onClick={() => dispatch(addOption({ questionId: q.id }))}
                  >
                    + Add option
                  </button>
                </div>

                <ul className="mt-2 space-y-2">
                  {q.options.map((o) => (
                    <li key={o.id} className="flex items-center gap-2">
                      <input
                        aria-label="Mark correct"
                        type={q.type === "single" ? "radio" : "checkbox"}
                        checked={!!o.isCorrect}
                        onChange={() =>
                          dispatch(toggleOptionCorrect({ questionId: q.id, optionId: o.id }))
                        }
                      />
                      <input
                        aria-label="Option text"
                        className="flex-1 border rounded px-2 py-1"
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
                      <button
                        className="px-2 py-1 border rounded text-red-600 cursor-pointer"
                        onClick={() => dispatch(removeOption({ questionId: q.id, optionId: o.id }))}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
