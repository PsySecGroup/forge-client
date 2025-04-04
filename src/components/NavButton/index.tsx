import styles from './index.module.css'
import { ParentProps, useContext } from 'solid-js'
import { getNavigationActions, NavigationContext } from '../../core'

type Props = {
  location: string
}

/**
 * 
 */
export function NavButton ({ location, children }: ParentProps<Props>) {
  const [ navigation ] = useContext(NavigationContext)
  const { goto } = getNavigationActions()

  const isActive = () => navigation.location === location
    ? styles['active']
    : ''

  return (
    <button
      class={isActive()}
      onClick={() => goto(location)}
    >
      {children}
    </button>
  )
}
