import { type StoreState, stores } from '../../state/register'

export function getStores (): StoreState {
  let result = {}

  for (const store of stores) {
    result = {
      ...result,
      ...store()
    }
  }

  return result
}
