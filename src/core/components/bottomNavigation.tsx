import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import { type ParentProps, type JSX, createSignal, For, batch, onCleanup } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'
import { fireOnce } from '../utils/events'

import styles from './css/bottomNavigation.module.css'

type Props = {
  option: string
  actions: {
    [key: string]: {
      icons: JSX.Element
      onClick?: () => void
      label?: string
    }
  }
  highlight?: boolean
  style?: Style
  classes?: Class
}

/**
 *
 */
export default function BottomNavigation (props: Props = {}): JSX.Element {
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
  const highlight = props.highlight ?? true
  const [actions, setActions] = createSignal(props.actions ?? {})
  const [option, setOption] = createSignal(props.option ?? '')

  onCleanup(() => {
    setActions(props.actions ?? {})
    setOption(props.option ?? '')
  })

  return (
    <div
      class={classes}
      style={style}
    >
      <For each={Object.keys(actions())}>
        {(key) => {
          const action = actions()[key]

          return (
            <div
              onClick={() => batch(() => {
                if (action.onClick) {
                  action.onClick(key)
                }
                setOption(key)
              })}
              classList={{
                [styles.bottomNavItem]: true,
                [styles.bottomNavItemSelected]: highlight && key === option()
              }}
            >
              {action.icon && (<div>{action.icon}</div>)}
              {action.label && (<div>{action.label}</div>)}
            </div>
          )
        }}
      </For>
    </div>
  )
}
