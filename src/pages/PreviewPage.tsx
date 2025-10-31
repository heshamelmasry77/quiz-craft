import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";

export default function PreviewPage() {
  const navigate = useNavigate();
  const questions = useAppSelector((s) => s.quiz.questions);

  return (
    <section aria-label="Student preview">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Quiz Preview</h1>
        <button
          className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ← Back to Builder
        </button>
      </header>

      {questions.length === 0 ? (
        <p className="text-gray-600 mt-2">No questions available.</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {questions.map((q, i) => (
            <li key={q.id} aria-label={`question-${i + 1}`} className="border rounded p-3">
              <p className="font-medium">
                {i + 1}. {q.title || <em className="text-gray-500">Untitled</em>}
              </p>

              {q.type === "short" ? (
                <div className="mt-2">
                  <label htmlFor={`answer-${q.id}`} className="text-sm">
                    Your answer
                  </label>
                  <input
                    id={`answer-${q.id}`}
                    className="mt-1 w-full border rounded px-2 py-2"
                    placeholder="Type your answer…"
                    readOnly
                  />
                </div>
              ) : (
                <ul className="mt-2 space-y-1">
                  {q.options.map((o) => (
                    <li key={o.id} className="flex items-center gap-2">
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        disabled
                        aria-hidden="true"
                      />
                      <span>{o.text || <em className="text-gray-500">Empty option</em>}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
