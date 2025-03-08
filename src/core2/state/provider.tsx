import { type ParentProps, type JSX, createContext } from 'solid-js'
import { defineStore } from './store' 
import type { BasicRecord } from '../types/basic'

export type StoreProviderProps = {
  state: BasicRecord | undefined
  store: (state?: BasicRecord) => typeof defineStore,
  context: ReturnType<typeof createContext>
}


export function StoreProvider(props: ParentProps<StoreProviderProps>): JSX.Element {
  const store = props.store(props.state)

  return (
    <props.context.Provider value={store}>
      {props.children}
    </props.context.Provider>
  )
}
