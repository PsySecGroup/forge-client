import type { type SetStoreFunction } from 'solid-js/store'
import type { Json } from './common'
import { createStore } from 'solid-js/store'
import { NOOP } from '../constants'
import { hydrateJson } from './json'

export type Values = {
  // (-->) Add simple primitives here
  closeEverything: boolean
}

type Concept = Values

export type StoreState = {
  values: Concept
  setValues: SetStoreFunction<Concept>
}

const defaultValues: Concept = {
  // (-->) Add simple primitive default values here
  closeEverything: false
}

/**
 *
 */
export function hydrate (json: string | Concept | Json = {}): Concept {
  // (-->) Add the default values of simple primitives here
  const result = hydrateJson<Concept>(json, defaultValues)

  return result
}

export const defaultState: StoreState = {
  values: hydrate(),
  setValues: NOOP
}

export const getStore = (): StoreState => {
  const [values, setValues] = createStore<Concept>(defaultValues)

  return {
    values,
    setValues
  }
}
