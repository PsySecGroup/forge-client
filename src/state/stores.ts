import { type Space } from '../types/space'
import { type Ui } from '../types/ui'
import { createLocalStore } from './localStore'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import { type Source } from '../types/source'
import { type GraphMessage } from '../types/graphMessage'
import { type Values } from '../types/values'
import { type GraphView } from './types'
import { defaults } from './defaults'

interface Stores {
  ui: Ui
  setUi: SetStoreFunction<Ui>
  spaces: Space[]
  setSpaces: SetStoreFunction<Space[]>
  sources: Source[]
  setSources: SetStoreFunction<Source[]>
  graphViews: GraphView[]
  setGraphViews: SetStoreFunction<GraphView[]>
  graphMessages: GraphMessage[]
  setGraphMessages: SetStoreFunction<GraphMessage[]>
  values: Values
  setValues: SetStoreFunction<Values>
}

export function getStores (): Stores {
  // Persisting stores
  const [ui, setUi] = createLocalStore<Ui>('ui', defaults.ui)
  const [spaces, setSpaces] = createLocalStore<Space[]>('spaces', defaults.spaces)
  const [sources, setSources] = createLocalStore<Source[]>('spaces', defaults.sources)

  // Temporary Store
  const [graphViews, setGraphViews] = createStore<GraphView[]>([])
  const [graphMessages, setGraphMessages] = createStore<GraphMessage[]>([])
  const [values, setValues] = createStore<Values>(defaults.values)

  return {
    ui,
    setUi,
    spaces,
    setSpaces,
    sources,
    setSources,
    graphViews,
    setGraphViews,
    graphMessages,
    setGraphMessages,
    values,
    setValues
  }
}
