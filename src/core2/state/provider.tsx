import { type ParentProps, type JSX } from 'solid-js'
import { RegisteredContext } from './context'
import { RecordKey } from './store'
import { createStore } from 'solid-js/store'

type Props<T extends Record<RecordKey, any>> = {
  context: RegisteredContext<T>
}

export function StateProvider<T extends Record<RecordKey, any>>(props: ParentProps<Props<T>>): JSX.Element {
  const { getStore, context } = props.context
  // const store = getStore()
  const a = createStore({ a: 7})

  return (
    <context.Provider value={a}>
      {props.children}
    </context.Provider>
  )
}
