import type { BasicRecord } from 'src/core2/types/basic'
import type { ParentProps } from 'solid-js'
import { type StoreProviderProps, StoreProvider } from '../../state/provider'

export function App<T extends BasicRecord> (props: ParentProps<StoreProviderProps<T>>) {
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
