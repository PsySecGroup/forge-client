import { NOOP } from '../../constants'
import { hydrate as hydrateValues } from '../../concepts/values'
import Types from '../../concepts/register'

export const defaults = {
  values: hydrateValues({}),
  setValues: NOOP,
  ...Types
}
