// (-->) Import the StoreState and getStore for Concepts here
import { type StoreState as UiStoreState, getStore as getUiStore } from '../concepts/ui'
import { type StoreState as ValuesStoreState, getStore as getValuesStore } from '../concepts/values'

export type StoreState = ValuesStoreState
  // (-->) Register StoreStates here
  & UiStoreState

export const stores = [
  // (-->) Register getStores here
  getValuesStore,
  getUiStore
]
