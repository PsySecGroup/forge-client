import type { SetStoreFunction } from 'solid-js/store'
import type { Themes } from '../themes'
import type { Json } from '../core/types'
import { NOOP } from '../constants'
import { persistingStore, hydrateJson } from '../core'

export type Ui = {
  theme: Themes
}

type Concept = Ui

export type StoreState = {
  ui: Concept
  setUi: SetStoreFunction<Concept>
}

const defaultValues: Concept = {
  theme: 'mainLight'
}

export const hydrate = (json: string | Concept | Json = {}): Concept => {
  return hydrateJson<Concept>(json, defaultValues)
}

export const defaultState: StoreState = {
  ui: hydrate(),
  setUi: NOOP
}

export const getStore = (): StoreState => {
  const [ui, setUi] = persistingStore<Concept>('ui', defaultValues)

  return {
    ui,
    setUi
  }
}
