import type { Dynamic, Json, HttpMethods } from '../types/common'
import { BASE_URL } from '../../constants'
import axios from 'axios'
// TODO import { HardenedFetch } from 'hardened-fetch'

type Options = {
  method: HttpMethods
  url: string
  headers: {
    'content-type': 'application/json'
  }
  responseType: 'json'
  data?: string
  params?: Dynamic
}

/**
 *
 */
export const fetchGet = async (resourceUrl: string, data?: Dynamic): Promise<Dynamic> => {
  return await fetch('get', resourceUrl, data)
}

/**
 *
 */
export const fetchPost = async (resourceUrl: string, data?: Dynamic): Promise<Dynamic> => {
  return await fetch('post', resourceUrl, data)
}

/**
 * TODO repalce testResult with an axios mock
 */
export const fetch = async <T = Dynamic>(method: HttpMethods, resourceUrl: string, data?: Dynamic, testResult?: Dynamic): Promise<T> => {
  if (testResult !== undefined) {
    return testResult
  }

  try {
    const options: Options = {
      method,
      url: BASE_URL + resourceUrl,
      responseType: 'json',
      headers: {
        'content-type': 'application/json'
      }
    }

    if (data !== undefined) {
      if (method === 'get') {
        options.params = data as unknown
      } else if (method === 'post') {
        options.data = JSON.stringify(data)
      }
    }

    const json = await axios(options) as Json

    return json.data
  } catch (e) {
    console.error(e)
  }
}
