import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
// Import the types we defined in store/index.ts to provide proper TypeScript support.
import type { AppDispatch, RootState } from "./index";

/**
 * Custom typed versions of the standard Redux hooks.
 * --------------------------------------------------
 * Why:
 * - In a TypeScript + Redux Toolkit project, we want full type safety when
 *   dispatching actions or selecting state.
 * - These wrappers ensure that:
 *    • `useAppDispatch` knows the correct dispatch type (AppDispatch)
 *    • `useAppSelector` knows the shape of the state (RootState)
 *
 * Usage:
 * Instead of using `useDispatch()` or `useSelector()` directly,
 * always use these typed versions throughout the app.
 */

// Typed dispatch hook — ensures dispatch is aware of thunk types and slices.
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed selector hook — provides autocompletion and type safety for state.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
