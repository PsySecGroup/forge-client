import { type ParentProps, type JSX, createContext } from 'solid-js'
import type { BasicRecord } from '../types/basic'
import { defineStore } from './store' 

export type StoreProviderProps = {
  state: BasicRecord | undefined
  store: (state: BasicRecord | undefined) => ReturnType<typeof defineStore>,
  //context: ReturnType<typeof createContext<BasicRecord>>
  context: ReturnType<typeof createContext<BasicRecord>>
}

export function StoreProvider(props: ParentProps<StoreProviderProps>): JSX.Element {
  const store = props.store(props.state)

  return (
    <props.context.Provider value={store}>
      {props.children}
    </props.context.Provider>
  )
}
