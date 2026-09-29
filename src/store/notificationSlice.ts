// src/store/notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
  isOpen: boolean;
  message: string;
  type: "success" | "failure" | "info";
}

const initialState: ToastState = {
  isOpen: false,
  message: "",
  type: "success",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Action called by any form or table view to push a toast notice
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: "success" | "failure" | "info";
      }>,
    ) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    hideToast: (state) => {
      state.isOpen = false;
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
