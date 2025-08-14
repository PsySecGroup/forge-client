import { type ParentProps, type JSX } from 'solid-js'
import { Palette } from './palette'
import { StoreProvider } from '../state/provider'
import { ThemeContext, ThemeStore } from './state'

export function ThemeProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={ThemeContext}
      store={ThemeStore}
    >
      {children}
    </StoreProvider>
  )
}

// Used on createEffect for a Layout component
// @TODO explore this better
export function updateTheme (theme: Palette) {
  const root = document.documentElement
    
  // Set CSS custom properties
  if (theme.primary) {
    root.style.setProperty('--primary-main', theme.primary.main || '')
    root.style.setProperty('--primary-light', theme.primary.light || '')
    root.style.setProperty('--primary-dark', theme.primary.dark || '')
    root.style.setProperty('--primary-text', theme.primary.text || '')
  }
}