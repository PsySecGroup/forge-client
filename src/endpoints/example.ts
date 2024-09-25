import type { Dynamic, Json, HttpMethods } from '../core/types/index'
import { fetch, urlParser } from '../core/utils/fetch'
import { useError } from '../core/state/error'

// (-->) Add concepts here
import { User } from '../concepts/user'

// (-->) Add fetches here
export async function FetchUser (data: Dynamic): Promise<User> {
  const { addError } = useError()

  const url = urlParser('api/user/:id', data)

  try {
    // TODO Hydrate?
    return fetch('get', url, data)
  } catch (e) {
    addError(`Could not complete fetch of ${url}`)
    console.error(e.error)
  }
}
