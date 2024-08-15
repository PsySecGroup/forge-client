import { type Ui } from '../types/ui'
import { createLocalStore } from './localStore'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import { type Values } from '../types/values'
import { defaults } from './defaults'

type Stores = {
  // Add persisting data here
  ui: Ui
  setUi: SetStoreFunction<Ui>

  // Add temporary data here
  values: Values
  setValues: SetStoreFunction<Values>
}

export function getStores (): Stores {
  // Add persisting data here
  const [ui, setUi] = createLocalStore<Ui>('ui', defaults.ui)

  // Add temporary data here
  const [values, setValues] = createStore<Values>(defaults.values)

  return {
    // Add persisting data here
    ui,
    setUi,

    // Add temporary data here
    values,
    setValues
  }
}
