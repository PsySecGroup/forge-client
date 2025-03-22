import { createLocalStore } from '../../state/localStore'
import { createContext } from 'solid-js'
import { defineActions } from '../../state/actions'

const state = {
  name: 'default'
}

export const store = createLocalStore('forms', state)

type SetState = typeof store[1]

export const formsContext = createContext(store)
export const formsStore = store
export const getFormsActions = defineActions(store, (set: SetState) => ({
  updateName: (name: string) => set('name', name),
}))
