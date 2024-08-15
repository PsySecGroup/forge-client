import type { Themes } from '../themes'
import type { Json } from './common'
import { hydrateJson } from './json'

export type Ui = {
  theme: Themes
}

type Concept = Ui

/**
 *
 */
export function hydrate (json: string | Concept | Json): Concept {
  const result = hydrateJson<Concept>(json, {
    theme: 'mainLight'
  })

  return result
}
