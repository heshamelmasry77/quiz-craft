import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ConfirmAction = { type: "clear-quiz" } | { type: "none" };

type ModalState = {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  action: ConfirmAction;
};

const initialState: ModalState = {
  isOpen: false,
  action: { type: "none" },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openConfirm(
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        action: ConfirmAction;
      }>,
    ) {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.confirmText = action.payload.confirmText ?? "Confirm";
      state.cancelText = action.payload.cancelText ?? "Cancel";
      state.action = action.payload.action;
    },
    close(state) {
      state.isOpen = false;
      state.action = { type: "none" };
    },
  },
});

export const { openConfirm, close } = modalSlice.actions;
export default modalSlice.reducer;
