import type { Component, Style, Class } from '../types'
import { mergeStyle } from '../utils/style'
import type { ParentProps } from 'solid-js'
// import useTheme from '@suid/material/styles/useTheme'

import styles from './css/button.module.css'

type Props = {
  onClick?: (e?: any) => void
  style?: Style
  classes?: Class
}

/**
 * 
 */
export default function Button (props: ParentProps<Props> = {}): Component {
  // Styling
  // const theme = useTheme()

  const { style, classes } = mergeStyle(
    props,
    styles['Button']
  )

  // Rendering
  return (
    <button
      onClick={props.onClick}
      class={classes}
      style={style}
    >
      {props.children}
    </button>
  )
}
