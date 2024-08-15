import type { Json } from './common'
import { hydrateJson } from './json'

export type Values = {
  // Add simple primitives here
  closeEverything: boolean
}

type Concept = Values

/**
 *
 */
export function hydrate (json: string | Concept | Json): Concept {
  // Add the default values of simple primitives here
  const result = hydrateJson<Concept>(json, {
    closeEverything: false
  })

  return result
}
