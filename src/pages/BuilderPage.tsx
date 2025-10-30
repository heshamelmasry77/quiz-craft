import { useAppDispatch, useAppSelector } from "../store/hooks";
import { incrementQuestions } from "../store/quizSlice";

export default function BuilderPage() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((s) => s.quiz.questionsCount);

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">Accessible Quiz Builder</h1>
      <p className="text-sm text-gray-600">Redux wired: questionsCount = {count}</p>
      <button className="px-3 py-2 border rounded" onClick={() => dispatch(incrementQuestions())}>
        + Increment (test)
      </button>
    </section>
  );
}
