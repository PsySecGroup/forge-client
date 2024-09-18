import { type JSX, Switch, Match } from 'solid-js'
import { useStoreContext } from '../../core'

type Props = {
  routes: {
    [key: string]: JSX.Element
  }
}

/**
 * 
 */
export default function Navigation ({ routes }: Props = {}): JSX.Element {
  // State
  const { navigation, changeLocation } = useStoreContext()
  const matches = []

  // Rendering
  for (const route of Object.keys(routes)) {
    matches.push(<Match when={navigation.location === route}>
      {routes[route]}
    </Match>)
  }

  return (
    <div>
      <Switch>
        {matches}
      </Switch>
    </div>
  )
}
