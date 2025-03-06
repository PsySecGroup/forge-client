import { type ParentProps, type JSX } from 'solid-js'
import { RegisteredContext } from './context'

type Props<T> = {
  context: RegisteredContext<T>
}

export function StateProvider<T>(props: ParentProps<Props<T>>): JSX.Element {
  const { get, context } = props.context

  return (
    <context.Provider value={get()}>
      {props.children}
    </context.Provider>
  )
}
