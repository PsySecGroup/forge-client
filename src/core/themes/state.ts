import { createStore } from 'solid-js/store'
import { createContext } from 'solid-js'
import { getActions } from '../state/actions'
import { getPalette } from './palette'

const state = getPalette('#00AA00')

type State = typeof state

export const store = createStore(state)

type SetState = typeof store[1]

export const themeContext = createContext(store)
export const themeStore = store
export const getThemeActions = getActions(store, (set: SetState) => ({
  setTheme: (theme: State) => set(theme)
}))
