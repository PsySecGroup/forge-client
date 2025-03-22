import { createStore } from 'solid-js/store'
import { createContext } from 'solid-js'
import { defineActions } from '../state/actions'
import { getPalette } from './palette'

const state = getPalette('#00AA00')

type State = typeof state

export const store = createStore(state)

type SetState = typeof store[1]

export const ThemeContext = createContext(store)
export const ThemeStore = store
export const getThemeActions = defineActions(store, (set: SetState) => ({
  setTheme: (theme: State) => set(theme)
}))
