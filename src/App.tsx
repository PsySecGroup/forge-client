import { type Component, onCleanup } from 'solid-js'
import { addGlobalEvent } from './core/utils/events'
import { useStoreContext } from './core'
import ThemesProvider from './themes'
import Navigation from './core/components/navigation'

import styles from './App.module.css'

// (-->) Import pages here
import MainPage from './pages/index'

const App: Component = () => {
  const { closeEverything } = useStoreContext()

  onCleanup(addGlobalEvent('keydown', e => {
    if (e.key === '`') {
      closeEverything()
    }
  }))

  return (
    <ThemesProvider>
      <Navigation routes={{
        // (-->) Add pages here
        '': <MainPage />
      }} />
    </ThemesProvider>
  )
}

export default App
