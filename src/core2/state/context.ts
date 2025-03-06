import { type Context, createContext, useContext } from "solid-js"

export type RegisteredContext<T> = {
  get: () => T,
  readonly context: Context<T>
}

// Instead of a Record with a string key and `any` value, we use a more specific mapped type.
const contexts: Record<string, Context<any>> = {}

/**
 * Register a context by name and defaults and returns a function to use that context
 */
export function registerContext<T>(name: string, defaults: T): RegisteredContext<T> {
  if (contexts[name] === undefined) {
    const context = createContext<T>(defaults)

    contexts[name] = context
  }

  return {
    get: () => useContext<T>(contexts[name] as Context<T>),
    context: contexts[name]
  }
}
