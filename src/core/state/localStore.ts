import type { BasicRecord } from '../types/basic';
import { type SetStoreFunction, createStore } from 'solid-js/store';
import { createEffect, createRoot } from 'solid-js';

/**
 * Creates a SolidJS store that synchronizes with localStorage.
 * @param storeName The key to be used in localStorage.
 * @param initialState The initial state for the store if no value exists in localStorage.
 * @returns A tuple containing the store state and a setter function.
 */
export function createLocalStore<T extends BasicRecord>(
  storeName: string,
  initialState: T
): [T, SetStoreFunction<T>] {
  let store: [T, SetStoreFunction<T>] | undefined;

  // Initialize the store within the root scope
  createRoot(() => {
    // Try to get the stored state from localStorage, or use the initial state
    const savedState = localStorage.getItem(storeName);
    const parsedState = savedState ? JSON.parse(savedState) : initialState;

    // Create the store using the parsed state
    store = createStore<T>(parsedState);

    // Synchronize changes to localStorage when state changes
    createEffect(() => {
      if (store) {
        localStorage.setItem(storeName, JSON.stringify(store[0]));
      }
    });
  });

  // Ensure the store has been initialized before returning
  if (!store) {
    throw new Error("Store has not been initialized yet.");
  }

  return store;
}
