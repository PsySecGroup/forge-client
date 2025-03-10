import { type SetStoreFunction, createStore } from 'solid-js/store'
import { type JSX, type ParentProps, type Context, createContext, useContext } from 'solid-js'

type RecordKey = string | number | symbol
type BasicRecord = Record<RecordKey, any>

// actions.ts

/**
 * Defines mutating actions for a state
 */
export function getActions<
  T extends BasicRecord,
  A extends Record<string, (...args: any[]) => void>
>(
  [, setStore]: [get: T, set: SetStoreFunction<T>],
  actions: (set: SetStoreFunction<T>) => A
): () => A {
  return () => actions(setStore)
}

// storeProvider.tsx
type newStoreProviderProps<StoreType> = {
  context: Context<StoreType>,
  store: StoreType
}

function StoreProvider<StoreType>(
  { context, store, children }: ParentProps<newStoreProviderProps<StoreType>>
): JSX.Element {
  return (
    <context.Provider value={store}>
      {children}
    </context.Provider>
  )
}

// components/app.tsx
export function App<T> (
  { context, store, children }: ParentProps<newStoreProviderProps<T>>
): JSX.Element {
  return (
    <>
      <StoreProvider
        context={context}
        store={store}
      >
        {children}
      </StoreProvider>
    </>
  )
}

// states/example.ts
const state = {
  count: 1
}

type State = typeof state

export const store = createStore(state)

type SetState = typeof store[1]

export const exampleContext = createContext(store)
export const exampleStore = store
export const getExampleActions = getActions(store, (set: SetState) => ({
  increment: (state: State) => set({ count: state.count + 1}),
}))

// components/counter.tsx
export function Counter () {
  const [ state ] = useContext(exampleContext)
  const { increment } = getExampleActions()

  return (<div>
    {state.count}
    <button onclick={() => increment(state)}>Increment</button>
  </div>)
}

// pages/main.tsx
export function Main () {
  return (<App
    context={exampleContext}
    store={exampleStore}
  >
    <Counter />
  </App>)
}
