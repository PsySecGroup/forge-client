import type { Component } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from './core'
import ThemesProvider from './themes'
import Navigation from './components/navigation'
import styles from './App.module.css'

// (-->) Import pages here
import MainPage from './pages/index'

const App: Component = () => {
  const { values, navigation, changeLocation } = useStoreContext()
  return (
    <ThemesProvider>
      <Box>
        <Navigation routes={{
          // (-->) Add pages here
          main: <MainPage />
        }} />
        <button onClick={() => changeLocation('main')}>
          Go to Index
        </button>

      </Box>
    </ThemesProvider>
  )
}

export default App
