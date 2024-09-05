import type { Component, ParentProps } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'
import styles from './css/button.module.css'

interface Props extends ParentProps {
  class?: string[]
  test?: string
  onClick?: (e?: any) => void
}

const Button: Component<Props> = (props) => {
  const theme = useTheme()

  return (
    <button
      onClick={props.onClick}
      class={styles.Button}
    >
      {props.children}
    </button>
  )
}

export default Button
