import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

export default function PreviewPage() {
  const navigate = useNavigate();
  const questions = useAppSelector((s) => s.quiz.questions);

  return (
    <section aria-label="Student preview" className="space-y-5">
      <PageHeader
        title="Quiz Preview"
        actions={
          <Button variant="neutral" onClick={() => navigate("/")}>
            ← Back to Builder
          </Button>
        }
      />

      {questions.length === 0 ? (
        <p className="text-gray-600">No questions available.</p>
      ) : (
        <ol data-testid="preview-list" className="space-y-6">
          {questions.map((q, i) => (
            <li
              key={q.id}
              aria-label={`question-${i + 1}`}
              className="border rounded-lg p-5 bg-white shadow-sm transition-shadow hover:shadow"
            >
              <p className="font-medium">
                {i + 1}. {q.title || <em className="text-gray-500">Untitled</em>}
              </p>

              {q.type === "short" ? (
                <div className="mt-3">
                  <label className="text-sm">Your answer</label>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer…"
                    readOnly
                  />
                </div>
              ) : (
                <ul className="mt-3 space-y-2">
                  {q.options.map((o) => (
                    <li key={o.id} className="flex items-center gap-3">
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        name={
                          q.type === "single"
                            ? `question-${q.id}`
                            : `question-${q.id}-option-${o.id}`
                        }
                        disabled
                        aria-hidden="true"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
