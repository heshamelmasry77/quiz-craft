import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addQuestion,
  removeQuestion,
  setQuestionType,
  updateQuestionTitle,
  undo,
  clearAll,
} from "../store/quizSlice";
import type { QuestionType } from "../types/quiz";

export default function BuilderPage() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.quiz.questions);

  const addQ = (type: QuestionType) => dispatch(addQuestion({ type }));

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap gap-2 items-center">
        <h1 className="text-xl font-semibold mr-auto">Accessible Quiz Builder</h1>
        <button className="px-3 py-2 border rounded" onClick={() => dispatch(undo())}>
          Undo
        </button>
        <button className="px-3 py-2 border rounded" onClick={() => dispatch(clearAll())}>
          Clear quiz
        </button>
      </header>

      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={() => addQ("single")}>
          + Single choice
        </button>
        <button className="px-3 py-2 border rounded" onClick={() => addQ("multiple")}>
          + Multiple choice
        </button>
        <button className="px-3 py-2 border rounded" onClick={() => addQ("short")}>
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
                className="ml-auto px-2 py-1 border rounded text-red-600"
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
          </li>
        ))}
      </ol>
    </section>
  );
}
