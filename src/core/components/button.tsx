import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import type { Component, ParentProps } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/button.module.css'

interface Props extends ParentProps {
  class?: string[]
  test?: string
  onClick?: (e?: any) => void
  style?: Style
  classes?: Class
}

const Button: Component<Props> = (props) => {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.Button
  )

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

export default Button
