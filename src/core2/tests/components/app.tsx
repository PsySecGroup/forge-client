import type { ParentProps } from 'solid-js'
import { StateProvider } from '../../state/provider'
import { RegisteredContext } from 'src/core2/state/context'

type Props<T> = {
  context: RegisteredContext<T>
}

export function App<T> (props: ParentProps<Props<T>>) {
  return (
    <StateProvider context={props.context}>
      {props.children}
    </StateProvider>
  )
}
