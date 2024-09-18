import { render } from 'solid-js/web'
import App from './App'
import { StoreProvider } from './core'
import { ErrorProvider } from './core/state/error'
import './index.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?')
}

render(() => (
  <StoreProvider>
    <ErrorProvider>
      <App />
    </ErrorProvider>
  </StoreProvider>
), root!)
