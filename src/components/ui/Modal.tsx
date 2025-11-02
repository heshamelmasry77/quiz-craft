import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { close } from "../../store/modalSlice";
import { clearAll } from "../../store/quizSlice";
import { clearQuizStorage } from "../../lib/storage";
import Button from "./Button";

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
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-3 text-sm text-gray-700">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <Button data-testid="modal-cancel" variant="neutral" onClick={handleCancel}>
            {cancelText ?? "Cancel"}
          </Button>

          <Button data-testid="modal-confirm" variant="danger" onClick={handleConfirm}>
            {confirmText ?? "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
