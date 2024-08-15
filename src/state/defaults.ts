import { NOOP } from '../constants'
import { hydrate as hydrateUi } from '../types/ui'
import { hydrate as hydrateValues } from '../types/values'

export const defaults = {
  // Add data domains here
  ui: hydrateUi({}),
  setUi: NOOP,
  values: hydrateValues({}),
  setValues: NOOP
}
