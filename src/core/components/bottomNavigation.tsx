import { BottomNavigation, BottomNavigationAction, Box } from '@suid/material'
import { type ParentProps, type JSX, createSignal, batch } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/bottomNavigation.module.css'

interface Props extends ParentProps {
  highlight: boolean
  actions: {
    [key: string]: {
      icons: JSX.Element
      onClick: () => void
      label?: string
    }
  }
}

export default function BottomNav({ actions, highlight }): JSX.Element {
  const theme = useTheme()

  const [icon, setIcon] = createSignal<string>('')
  const options = []
  for (const key of Object.keys(actions)) {
    const action = actions[key]

    const iconDiv = action.icon === undefined
      ? <></>
      : <div>{action.icon}</div>

    const labelDiv = action.label === undefined
      ? <></>
      : <div>{action.label}</div>

    options.push(<div
      onClick={() => {
        batch(() => {
          action.onClick(key)
          setIcon(key)
        })
      }}
      classList={{
        [styles.bottomNavItem]: true,
        [styles.bottomNavItemSelected]: highlight && key === icon()
      }}
    >
      {iconDiv}
      {labelDiv}
    </div>)
  }

  return (
    <div
      class={styles.bottomNavContainer}
      style={{
        background: theme.palette.primary.dark, 
        color: theme.palette.primary.contrastText
      }}
    >
      {options}
    </div>
  )
}
