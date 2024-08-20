import { NOOP } from '../constants'
import type { SetStoreFunction } from 'solid-js/store'
import type { Float, HexColor, GUID, Integer, Json, ID } from '../core/types'
import { hydrateCollection, hydrateDate, hydrateJson } from '../core'
import { persistingStore } from '../core'

type ClusterTypes = 'concepts' | 'relations' | 'tokens'

export type Space = {
  id: ID
  name: string
  createdAt: Date
  isFocused: boolean
  query: string
  parentSpaces: Space[]
  cameraX: Float
  cameraY: Float
  cameraZ: Float
  documentStores: ID[]
  enrichIds: GUID[]
  coverage: number
  sort: 'relevance' | 'distance' | 'topical'
  sortDir: 'asc' | 'desc'
  range: Integer
  count: Integer
  position: 'top' | 'middle' | 'bottom' | 'all'
  view: 'graph' | 'table' | 'sources'
  clustering: ClusterTypes
  persisting: Record<ClusterTypes, string[]>
  selected: Record<ClusterTypes, string[]>
  graphDepth?: Integer
  palette?: HexColor[]
  backgroundColor?: HexColor
}

type Concept = Space

export type StoreState = {
  space: Concept
  setSpace: SetStoreFunction<Concept>
}

const defaultValues: Concept = {
  palette: [],
  backgroundColor: '#000000',
  graphDepth: 5,
  coverage: 67,
  sort: 'relevance',
  sortDir: 'asc',
  range: 1000,
  count: 50,
  position: 'all',
  view: 'graph',
  clustering: 'concepts',
  persisting: {
    concepts: [],
    relations: [],
    tokens: []
  },
  selected: {
    concepts: [],
    relations: [],
    tokens: []
  },
  cameraX: 0,
  cameraY: 0,
  cameraZ: 0,
  name: '',
  id: 1,
  isFocused: true,
  documentStores: [],
  query: '',
  parentSpaces: []
}

/**
 *
 */
export function hydrate (json: string | Concept | Json = {}): Concept {
  const result = hydrateJson<Concept>(json, defaultValues)

  result.createdAt = hydrateDate(result, 'createdAt')
  result.parentSpaces = hydrateCollection<Concept>(result.parentSpaces, hydrate)
  
  return result
}

export const defaultState: StoreState = {
  space: hydrate(),
  setSpace: NOOP
}

export const getStore = (): StoreState => {
  const [space, setSpace] = persistingStore<Concept>('space', defaultValues)

  return {
    space,
    setSpace
  }
}
