import type { SetStoreFunction } from 'solid-js/store'
import type { Json } from '../core/types'
import { NOOP } from '../constants'
import { persistingStore, hydrateJson } from '../core'

export type Navigation = {
  location: string
}

type Concept = Navigation

export type StoreState = {
  navigation: Concept
  setNavigation: SetStoreFunction<Concept>
}

const defaultValues: Concept = {
  location: window.location.hash.replace('#', '')
}

export const hydrate = (json: string | Concept | Json = {}): Concept => {
  return hydrateJson<Concept>(json, defaultValues)
}

export const defaultState: StoreState = {
  navigation: hydrate(),
  setNavigation: NOOP
}

export const getStore = (): StoreState => {
  const [navigation, setNavigation] = persistingStore<Concept>('navigation', defaultValues)

  return {
    navigation,
    setNavigation
  }
}
