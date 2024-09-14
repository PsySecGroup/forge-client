import type { Style, Class } from '../types/index'
import { type ParentProps, type JSX, createSignal, batch, onMount } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'
import { mergeStyle } from '../utils/style'
import { fireOnce } from '../utils/events'

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
  option?: string

  style?: Style
  class?: Class
}
  let hasLoaded = false

/**
 *
 */
export default function BottomNavigation (props: Props): JSX.Element {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.bottomNavContainer,
    {
      background: theme.palette.secondary.background,
      color: theme.palette.secondary.text
    }
  )

  // State
  const [option, setOption] = createSignal<string>(props.option ?? '')
  const options = []

  // Rendering
  for (const key of Object.keys(props.actions)) {
    const action = props.actions[key]
    const isOption = key === option()

    if (isOption) {
      fireOnce(() => {
        console.log('here')
        action.onClick(key)
      })
    }

    options.push(<div
      onClick={() => {
        batch(() => {
          action.onClick(key)
          setOption(key)
        })
      }}
      classList={{
        [styles.bottomNavItem]: true,
        [styles.bottomNavItemSelected]: props.highlight && isOption
      }}
    >
      {action.icon && (<div>{action.icon}</div>)}
      {action.label && (<div>{action.label}</div>)}
    </div>)
  }

  return (
    <div
      class={classes}
      style={style}
    >
      {options}
    </div>
  )
}
