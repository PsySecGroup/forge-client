import { type ParentProps, type JSX } from 'solid-js'
import { StoreProvider, type StoreProviderProps } from '../../state/provider'

export function App<T> (
  { context, store, children }: ParentProps<StoreProviderProps<T>>
): JSX.Element {
  return (
    <StoreProvider
      context={context}
      store={store}
    >
      {children}
    </StoreProvider>
  )
}
