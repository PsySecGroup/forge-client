// Import JSX and context-related types from SolidJS
import { type JSX, type ParentProps, type Context } from 'solid-js'

/**
 * Props for the `StoreProvider` component.
 *
 * @template StoreType - The shape of the store (context value).
 *
 * @property context - A SolidJS context object (created via `createContext`).
 * @property store - The value to provide to the context (usually a store or signal group).
 */
export type StoreProviderProps<StoreType> = {
  context: Context<StoreType>,
  store: StoreType
}

/**
 * A generic context provider component for SolidJS applications.
 *
 * This utility simplifies the process of wrapping children in a context provider
 * by making it reusable for any store or state object.
 *
 * It is especially useful when you want to:
 * - Avoid repeating provider boilerplate
 * - Dynamically pass different contexts or stores
 * - Create modular and composable store systems
 *
 * @template StoreType - The shape of the value being injected into context.
 *
 * @param context - The SolidJS context to provide (created via `createContext()`).
 * @param store - The value to be injected into the context.
 * @param children - The JSX children to be rendered inside the context provider.
 *
 * @returns A JSX element with the given store provided via context.
 *
 * @example
 * ```ts
 * const CounterContext = createContext<{ count: number, setCount: Setter<number> }>()
 * const [count, setCount] = createSignal(0)
 *
 * <StoreProvider context={CounterContext} store={{ count: count(), setCount }}>
 *   <CounterDisplay />
 * </StoreProvider>
 * ```
 */
export function StoreProvider<StoreType>(
  { context, store, children }: ParentProps<StoreProviderProps<StoreType>>
): JSX.Element {
  return (
    <context.Provider value={store}>
      {children}
    </context.Provider>
  )
}
