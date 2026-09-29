import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux'; // FIXED: Added type-only import keyword
import type { RootState, AppDispatch } from './rootStore';

// Use these custom hooks throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
