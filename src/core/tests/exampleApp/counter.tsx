import { useContext } from 'solid-js'
import { exampleContext, getExampleActions } from './state'

export function Counter () {
  const [ state ] = useContext(exampleContext)
  const { increment } = getExampleActions()

  return (<div>
    {state.count}
    <button onclick={() => increment(state)}>Increment</button>
  </div>)
}
