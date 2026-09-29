import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { authReducer } from "@/features/auth";
import { uiReducer } from "./uiSlice";
import { notificationReducer } from "./notificationSlice";
import { confirmReducer } from "./confirmSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ui: uiReducer,
    notification: notificationReducer,
    confirmDialog: confirmReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
