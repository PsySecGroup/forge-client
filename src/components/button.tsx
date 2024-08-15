import type { Component, ParentProps } from 'solid-js'
import styles from './css/button.module.css'

interface Props extends ParentProps {
  class?: string[]
  test?: string
  onClick?: (e?: any) => void
}

const Button: Component<Props> = (props) => {
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
