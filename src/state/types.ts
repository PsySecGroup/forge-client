import type { Optional } from '../types/common' 
import type { Ui } from '../types/ui'
import type { SetStoreFunction } from 'solid-js/store'
import type { Values } from '../types/values'

export type StoreState = {
  // Add type signatures of data domains here
  ui: Ui
  setUi: SetStoreFunction<Ui>
  values: Values
  setValues: (newValue: Optional<Values>) => void
}
