import type { SetStoreFunction } from 'solid-js/store'
import type { Json } from '../core/types'
import { NOOP } from '../constants'
import { temporaryStore, hydrateJson } from '../core'

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
  const result = hydrateJson<Concept>(json, defaultValues)

  // (-->) If complex hydration is needed for arrays or dates, it is done here

  return result
}

export const defaultState: StoreState = {
  values: hydrate(),
  setValues: NOOP
}

export const getStore = (): StoreState => {
  const [values, setValues] = temporaryStore<Concept>(defaultValues)

  return {
    values,
    setValues
  }
}
