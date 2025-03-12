import { type ParentProps, type JSX } from 'solid-js'
import { StoreProvider } from '../state/provider'
import { themeContext, themeStore } from './state'

export function ThemeProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={themeContext}
      store={themeStore}
    >
      {children}
    </StoreProvider>
  )
}
