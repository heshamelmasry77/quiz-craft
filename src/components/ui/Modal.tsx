import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { close } from "../../store/modalSlice";
import { clearAll } from "../../store/quizSlice";
import { clearQuizStorage } from "../../lib/storage";

export default function Modal() {
  const dispatch = useAppDispatch();
  const { isOpen, title, message, confirmText, cancelText, action } = useAppSelector(
    (s) => s.modal,
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    switch (action.type) {
      case "clear-quiz":
        dispatch(clearAll());
        clearQuizStorage();
        break;
      case "none":
      default:
        break;
    }
    dispatch(close());
  };

  const handleCancel = () => dispatch(close());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="bg-white rounded-xl shadow p-5 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 border rounded-md cursor-pointer" onClick={handleCancel}>
            {cancelText ?? "Cancel"}
          </button>
          <button
            className="px-3 py-2 border rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            onClick={handleConfirm}
          >
            {confirmText ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
