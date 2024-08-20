import { NOOP } from '../constants'
import { hydrate as hydrateValues } from '../types/values'
import Types from '../types/register'

export const defaults = {
  values: hydrateValues({}),
  setValues: NOOP,
  ...Types
}
