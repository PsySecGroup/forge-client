import { type ParentProps, type JSX } from 'solid-js'

import styles from './css/appBar.module.css'

interface Props extends ParentProps {
  children: JSX.Element[]
}

export default function AppBar ({ children }): JSX.Element {
  return (
    <div class={styles.appBar}>
      {children}
    </div>
  )
}
