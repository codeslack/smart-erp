// src/store/confirmSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  actionType: "post" | "cancel" | "delete" | null;
  targetId: string | number | null;
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: "",
  message: "",
  actionType: null,
  targetId: null,
};

const confirmSlice = createSlice({
  name: "confirmDialog",
  initialState,
  reducers: {
    // Action called by tables to trigger the global confirmation modal block
    openConfirmDialog: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        actionType: "post" | "cancel" | "delete";
        targetId: string | number;
      }>,
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.actionType = action.payload.actionType;
      state.targetId = action.payload.targetId;
    },
    closeConfirmDialog: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.actionType = null;
      state.targetId = null;
    },
  },
});

export const { openConfirmDialog, closeConfirmDialog } = confirmSlice.actions;
export const confirmReducer = confirmSlice.reducer;
