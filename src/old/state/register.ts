// (-->) Import the StoreState and getStore for Concepts here
import { type StoreState as ValuesStoreState, getStore as getValuesStore } from '../old/concepts/values'
import { type StoreState as UiStoreState, getStore as getUiStore } from '../old/concepts/ui'
import { type StoreState as NavigationStoreState, getStore as getNavigationStore } from '../old/concepts/navigation'

export type StoreState = ValuesStoreState
  // (-->) Register StoreStates here
  & UiStoreState
  & NavigationStoreState

export const stores = [
  // (-->) Register getStores here
  getValuesStore,
  getUiStore,
  getNavigationStore
]
