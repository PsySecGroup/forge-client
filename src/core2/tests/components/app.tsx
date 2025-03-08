import type { ParentProps } from 'solid-js'
import { type StoreProviderProps, StoreProvider } from '../../state/provider'

export function App (props: ParentProps<StoreProviderProps>) {
  return (
    <StoreProvider
      state={props.state}
      store={props.store}
      context={props.context}
    >
      {props.children}
    </StoreProvider>
  )
}
