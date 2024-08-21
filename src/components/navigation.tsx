import { type ParentProps, type JSX, Switch, Match } from 'solid-js'
import { useStoreContext } from '../core'
import styles from './css/navigation.module.css'

interface Props extends ParentProps {
  routes: {
    [key: string]: JSX.Element
  }
}

export default function Navigation ({ routes }: Props): JSX.Element {
  const { navigation, changeLocation } = useStoreContext()
  const matches = []

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
