import { addGlobalEvent } from '../core/utils/events'
import { Box } from '@suid/material'
import { type ParentProps, type JSX, onCleanup, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import logo from '../assets/logo.svg'
import styles from './index.module.css'

interface Props extends ParentProps {}

export default function MainPage (props: Props): JSX.Element {
  const { values, changeLocation, closeEverything } = useStoreContext()

  onCleanup(addGlobalEvent('keydown', e => {
    if (e.key === 'Escape') {
      closeEverything()
    }
  }))

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/pages/index.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Welcome to the Forge Client<br />
          Escape mode? ({values.closeEverything ? 'yes' : 'no'})
        </a>
      </header>
    </div>
  )
}
