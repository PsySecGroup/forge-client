import { type Context, createContext, useContext } from 'solid-js'
import { getStore, type RecordKey } from './store'

export type RegisteredContext<T extends Record<RecordKey, any>> = {
  get: () => T,
  getStore: () => ReturnType<typeof getStore<T>>
  readonly context: Context<T>
}

// Instead of a Record with a string key and `any` value, we use a more specific mapped type.
const contexts: Record<string, Context<any>> = {}

/**
 * Register a context by name and defaults and returns a function to use that context
 */
export function registerContext<T extends Record<RecordKey, any>>(name: string, defaults: T): RegisteredContext<T> {
  if (contexts[name] === undefined) {
    const context = createContext<T>(defaults)

    contexts[name] = context
  }

  return {
    // useContext can only be used inside of components :/
    get: () => useContext<T>(contexts[name] as Context<T>),
    getStore: () => getStore(defaults),
    context: contexts[name]
  }
}
