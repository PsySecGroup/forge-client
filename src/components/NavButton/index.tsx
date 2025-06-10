import styles from './index.module.css'
import { ParentProps, useContext } from 'solid-js'
import { getNavigationActions, NavigationContext } from '../../core'

type Props = {
  location?: string
  prefixHighlight?: boolean
}

/**
 * 
 */
export function NavButton ({ location, prefixHighlight, children }: ParentProps<Props>) {
  const [ navigation ] = useContext(NavigationContext)
  const { goto } = getNavigationActions()

  // TODO do styling
  const getClasses = () => prefixHighlight === true
    ? navigation.location.startsWith(location ?? '')
        ? styles['active']
        : ''
    : navigation.location === location
        ? styles['active']
        : ''

  return (
    <button
      class={`${styles['nav-button']} ${getClasses()}`}
      onClick={() => location !== undefined && goto(location)}
    >
      {children}
    </button>
  )
}
