import type { BasicRecord } from '../types/basic' 
import { type SetStoreFunction } from 'solid-js/store'

/**
 * Defines mutating actions for a state
 */
export function defineActions<
  T extends BasicRecord,
  A extends Record<string, (...args: any[]) => void>
>(
  [, setStore]: [get: T, set: SetStoreFunction<T>],
  actions: (set: SetStoreFunction<T>) => A
): () => A {
  return () => actions(setStore)
}
