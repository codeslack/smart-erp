import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage } from '@/utils/storage';
import type { ThemeMode } from '@/types/common';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

interface UiState {
  sidebarOpen: boolean;
  themeMode: ThemeMode;
  globalLoading: boolean;
  confirmDialog: ConfirmDialogState;
}

const initialTheme = storage.getTheme();

// Apply initial theme class to HTML element
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const initialState: UiState = {
  sidebarOpen: true,
  themeMode: initialTheme,
  globalLoading: false,
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    isDestructive: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      const nextTheme: ThemeMode = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = nextTheme;
      storage.setTheme(nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      storage.setTheme(action.payload);
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    openConfirmDialog: (
      state,
      action: PayloadAction<Omit<ConfirmDialogState, 'isOpen'>>
    ) => {
      state.confirmDialog = {
        isOpen: true,
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        isDestructive: false,
        ...action.payload,
      };
    },
    closeConfirmDialog: (state) => {
      state.confirmDialog.isOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setThemeMode,
  setGlobalLoading,
  openConfirmDialog,
  closeConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
