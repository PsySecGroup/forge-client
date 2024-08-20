import { type StoreState as UiStoreState, getStore as getUiStore } from '../types/ui'
import { type StoreState as ValuesStoreState, getStore as getValuesStore } from '../types/values'

export type StoreState = ValuesStoreState
  //  (-->) Register store states here
  & UiStoreState

export const stores = [
  //  (-->) Register stores here
  getValuesStore,
  getUiStore
]
