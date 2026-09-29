import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type DrawerContentType = 'ADD_USER' | 'ADD_LEDGER' | 'CREATE_INVOICE' | null;

interface UIState {
  drawer: {
    isOpen: boolean;
    contentType: DrawerContentType;
    payload: any;
  };
}

const initialState: UIState = {
  drawer: {
    isOpen: false,
    contentType: null,
    payload: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openGlobalDrawer: (
      state, 
      action: PayloadAction<{ contentType: DrawerContentType; payload?: any }>
    ) => {
      state.drawer.isOpen = true;
      // FIXED: Added .payload to target your parameters cleanly inside the RTK draft proxy
      state.drawer.contentType = action.payload.contentType;
      state.drawer.payload = action.payload.payload || null;
    },
    closeGlobalDrawer: (state) => {
      state.drawer.isOpen = false;
      state.drawer.contentType = null;
      state.drawer.payload = null;
    },
  },
});

// FIXED: Destructure actions from uiSlice.actions for full Redux Toolkit v2 compilation safety
export const { openGlobalDrawer, closeGlobalDrawer } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
