import type { Component } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from './state'
import ThemesProvider from './themes'
import logo from './assets/logo.svg'

import styles from './App.module.css'

const App: Component = () => {
  const { setValues } = useStoreContext()

  const closeEverything = (): void => {
    setValues({
      closeEverything: true
    })
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeEverything()
    }
  })

  return (
    <ThemesProvider>
      { /* Feel free to remove this */ }
      <div class={styles.App}>
        <header class={styles.header}>
          <img src={logo} class={styles.logo} alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            class={styles.link}
            href="https://github.com/solidjs/solid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Welcome to the Forge Client
          </a>
        </header>
      </div>
      <Box
        class={styles.App}
        onClick={closeEverything}
       >
        { /* Add pages here */ }

        { /*
          <Button onClick={() => { setUi('theme', 'mainDark') }}>
            <span>Dark</span>
          </Button>
          <Button onClick={() => {
            setUi({ ...ui, theme: 'mainLight' })
          }}>
            <span>Light</span>
          </Button>
        */ }
      </Box>
    </ThemesProvider>
  )
}

export default App
