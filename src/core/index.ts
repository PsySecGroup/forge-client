export {
  pushUnique,
  push,
  splice,
  find
} from './utils/lists'

export {
  fetchGet,
  fetchPost,
  fetch
} from './utils/fetch'

export {
  hydrateJson,
  hydrateDate,
  hydrateCollection
} from './types/json'

export {
  useStoreContext,
  StoreProvider
} from './state/index'

export {
  getStores
} from './state/stores'

export {
  createLocalStore as persistingStore
} from './state/localStore'

export {
  createStore as temporaryStore
} from 'solid-js/store'