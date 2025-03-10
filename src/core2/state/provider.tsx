import { type ParentProps, type JSX, createContext } from 'solid-js'
import type { BasicRecord } from '../types/basic'
import { defineStore } from './store' 

export type StoreProviderProps<T extends BasicRecord> = {
  state: T | undefined
  store: (state: T | undefined) => ReturnType<typeof defineStore<T>>,
  context: ReturnType<typeof createContext<ReturnType<typeof defineStore<T>>>>
}

export function StoreProvider<T extends BasicRecord>(props: ParentProps<StoreProviderProps<T>>): JSX.Element {
  const store = props.store(props.state)

  return (
    <props.context.Provider value={store}>
      {props.children}
    </props.context.Provider>
  )
}
