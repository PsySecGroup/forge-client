import { createStore } from 'solid-js/store'
import { createContext } from 'solid-js'
import { getActions } from '../../state/actions'

const state = {
  count: 1
}

type State = typeof state

export const store = createStore(state)

type SetState = typeof store[1]

export const exampleContext = createContext(store)
export const exampleStore = store
export const getExampleActions = getActions(store, (set: SetState) => ({
  increment: (state: State) => set({ count: state.count + 1}),
}))
