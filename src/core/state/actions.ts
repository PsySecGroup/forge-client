// Import a type that represents a generic object with string keys and unknown values
import type { BasicRecord } from '../types/basic'

// Import the SetStoreFunction type from SolidJS's reactive store system
import { type SetStoreFunction } from 'solid-js/store'

/**
 * A utility function that helps define and encapsulate a set of imperative
 * actions (mutations) tied to a SolidJS store.
 *
 * This is useful for creating modular, predictable action interfaces
 * that operate on reactive store state while maintaining encapsulation.
 *
 * @template T - The shape of the store (state object), extending BasicRecord.
 * @template A - A record of functions (actions) that operate on the store.
 *
 * @param param0 - A tuple containing:
 *   - `get`: The current state (unused here, but could be used in other variants).
 *   - `set`: The SolidJS store setter function for updating state.
 *
 * @param actions - A function that receives the `set` function and returns
 *                  a record of action functions. These can perform state mutations.
 *
 * @returns A function that, when called, returns the bound actions.
 *
 * @example
 * ```ts
 * const [state, setState] = createStore({ count: 0 })
 *
 * const useCounterActions = defineActions([state, setState], (set) => ({
 *   increment: () => set('count', c => c + 1),
 *   reset: () => set('count', 0)
 * }))
 *
 * const { increment, reset } = useCounterActions()
 * increment()  // state.count becomes 1
 * reset()      // state.count becomes 0
 * ```
 */
export function defineActions<
  T extends BasicRecord, // Store shape, must be an object-like type
  A extends Record<string, (...args: any[]) => void> // Action map with arbitrary parameters
>(
  [, setStore]: [get: T, set: SetStoreFunction<T>], // Tuple destructure (only using `set`)
  actions: (set: SetStoreFunction<T>) => A // Action factory using set function
): () => A {
  // Returns a factory function that returns the generated actions when invoked
  return () => actions(setStore)
}
