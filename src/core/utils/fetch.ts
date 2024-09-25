import type { Dynamic, Json, HttpMethods } from '../types/common'
import { API_URL } from '../../constants'
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

  // TODO attach authorization tokens

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
    throw new Error({
      method,
      resourceUrl,
      data,
      error: e
    })
  }
}

/**
 * 
 */
export const function urlParser(url: string, params: Record<string, string | number>) {
  return url.replace(/:([a-zA-Z_\-0-9]+)/g, (_, key) => {
    return params[key] ? params[key].toString() : `:${key}`;
  });
}

// TODO custom error interception?
/*
const handleError = (error: any) => {
  // Log the error, notify the user
  console.error('API Error:', error);
  return Promise.reject(error);
};

apiClient.interceptors.response.use((response) => response, handleError);
*/

// TODO success interception?
/*
const handleSuccess = (response: any) => {
  // Optional: route based on response status
  return response.data;
};

apiClient.interceptors.response.use(handleSuccess, handleError);

// TODO caching? axios-cache-adapter

// TODO cancellation?
/*
https://axios-http.com/docs/cancellation
*/
*/