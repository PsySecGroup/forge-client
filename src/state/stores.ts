// import type { Ui } from '../types/ui'
// import type { Values } from '../types/values'
import { type StoreState, stores } from './register'
// import { createStore } from 'solid-js/store'
// import { createLocalStore } from './localStore'
// import { defaults } from './defaults'

export function getStores (): StoreState {
  let result = {}

  for (const store of stores) {
    result = {
      ...result,
      ...store()
    }
  }

  return result

  /*
  // (-->) Add persisting data here
  const [ui, setUi] = createLocalStore<Ui>('ui', defaults.ui)

  const [values, setValues] = createStore<Values>(defaults.values)

  return {
    // (-->) Add persisting data here
    ui,
    setUi,

    // (-->) Add temporary data here
    values,
    setValues
  }
  */
}
