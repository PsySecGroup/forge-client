import { type JSX, type ParentProps, type Context } from 'solid-js'

export type StoreProviderProps<StoreType> = {
  context: Context<StoreType>,
  store: StoreType
}

export function StoreProvider<StoreType>(
  { context, store, children }: ParentProps<StoreProviderProps<StoreType>>
): JSX.Element {
  return (
    <context.Provider value={store}>
      {children}
    </context.Provider>
  )
}
