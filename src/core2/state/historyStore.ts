import type { BasicRecord } from '../types/basic';
import { type SetStoreFunction, createStore } from 'solid-js/store';
import { createEffect, createRoot } from 'solid-js';

/**
 * Creates a SolidJS store with history tracking (undo and redo) that is saved to localStorage.
 * @param storeName The key to be used in localStorage.
 * @param initialState The initial state for the store if no value exists in localStorage.
 * @returns A tuple containing the store state, setter function, undo and redo functions.
 */
export function createHistoryStore<T extends BasicRecord>(
  storeName: string,
  initialState: T
): [T, SetStoreFunction<T>, () => void, () => void] {
  let store: [T, SetStoreFunction<T>] | undefined;
  let history: T[] = [];        // Stack of previous states
  let future: T[] = [];         // Stack for redo functionality

  // Initialize the store within the root scope
  createRoot(() => {
    const savedState = localStorage.getItem(storeName);
    const savedHistory = localStorage.getItem(`${storeName}_history`);
    const savedFuture = localStorage.getItem(`${storeName}_future`);

    const parsedState = savedState ? JSON.parse(savedState) : initialState;
    const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
    const parsedFuture = savedFuture ? JSON.parse(savedFuture) : [];

    store = createStore<T>(parsedState);

    // Initialize history and future stacks from localStorage (or use empty arrays)
    history = [...parsedHistory, parsedState]; // Add the initial state to history
    future = parsedFuture;

    // Synchronize changes to localStorage when state or history changes
    createEffect(() => {
      if (store) {
        const currentState = store[0];
        localStorage.setItem(storeName, JSON.stringify(currentState));
        localStorage.setItem(`${storeName}_history`, JSON.stringify(history));
        localStorage.setItem(`${storeName}_future`, JSON.stringify(future));
      }
    });
  });

  // Ensure the store has been initialized before returning
  if (!store) {
    throw new Error("Store has not been initialized yet.");
  }

  /**
   * Updates the state, saving the current state to the history stack
   * before applying the new state.
   */
  const setState: SetStoreFunction<T> = (newState) => {
    if (store) {
      // Push the current state to the history stack before applying new state
      history.push(store[0]);
      future.length = 0; // Clear the future stack after a new action
      store[1](newState); // Update the store state
    }
  };

  /**
   * Undo the last state change by popping from the history stack.
   */
  const undo = () => {
    if (history.length > 1) {
      // Move the current state to the future stack and pop the last state from history
      future.push(history.pop()!); // Ensure history isn't empty before popping
      const prevState = history[history.length - 1];
      store![1](prevState); // Revert to the previous state
    }
  };

  /**
   * Redo the last undone state change by moving from the future stack.
   */
  const redo = () => {
    if (future.length > 0) {
      const nextState = future.pop()!;
      history.push(nextState); // Push the next state back to history
      store![1](nextState); // Apply the next state
    }
  };

  return [store[0], setState, undo, redo];
}
