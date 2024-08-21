// (-->) Import the StoreState and getStore for Concepts here
import { type StoreState as ValuesStoreState, getStore as getValuesStore } from '../concepts/values'
import { type StoreState as UiStoreState, getStore as getUiStore } from '../concepts/ui'
import { type StoreState as NavigationStoreState, getStore as getNavigationStore } from '../concepts/navigation'

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
