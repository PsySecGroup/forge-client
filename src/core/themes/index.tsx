import { type ParentProps, type JSX } from 'solid-js'
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
