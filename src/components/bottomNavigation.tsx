import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import { type JSX, createSignal, For, batch, onCleanup } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/bottomNavigation.module.css'

type Props = {
  option: string
  actions: {
    [key: string]: {
      icons: JSX.Element
      onClick?: (key?: string) => void
      label?: string
    }
  }
  highlight?: boolean
  style?: Style
  classes?: Class
}

const defaultProps = {
  option: '',
  actions: {}
}

/**
 *
 */
export default function BottomNavigation (props: Props = defaultProps): JSX.Element {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles['bottomNavContainer'],
    {
      background: theme.palette.secondary.background, // TODO theme stuff
      color: theme.palette.secondary.text // TODO theme stuff
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

          if (action === undefined) {
            return
          }

          return (
            <div
              onClick={() => batch(() => {
                if (action.onClick) {
                  action.onClick(key)
                }
                setOption(key)
              })}
              classList={{
                [styles['bottomNavItem'] as string]: true,
                [styles['bottomNavItemSelected'] as string]: highlight && key === option()
              }}
            >
              {action.icons && (<div>{action.icons}</div>)}
              {action.label && (<div>{action.label}</div>)}
            </div>
          )
        }}
      </For>
    </div>
  )
}
