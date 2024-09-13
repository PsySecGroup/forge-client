import { type ParentProps, type JSX } from 'solid-js'
import { useStoreContext } from '../core'

import styles from './css/viewport.module.css'

interface Props extends ParentProps {
  children: JSX.Element | JSX.Element[]
  header?: JSX.Element | JSX.Element[]
  footer?: JSX.Element | JSX.Element[]
}

export default function Viewport (props: Props): JSX.Element {
  return (
    <div class={styles.viewport}>
      {props.header && <div class={styles.viewportHeader}>{props.header}</div>}
      <div class={styles.viewportContent}>
        {props.children}
      </div>
      {props.footer && <div class={styles.viewportFooter}>{props.footer}</div>}
    </div>
  )
}
