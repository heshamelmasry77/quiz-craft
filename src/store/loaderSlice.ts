import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LoaderState = {
  isLoading: boolean;
  message?: string | null;
};

const initialState: LoaderState = {
  isLoading: false,
  message: null,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state, action: PayloadAction<string | undefined>) {
      state.isLoading = true;
      state.message = action.payload || "Loading...";
    },
    hideLoader(state) {
      state.isLoading = false;
      state.message = null;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
