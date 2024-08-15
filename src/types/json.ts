import type { Json, Optional, Dynamic } from './common'

/**
 * Populates a JSON with defaults if the JSON is partial
 */
export function hydrateJson<T = Dynamic> (json: string | T | Json, defaults: Optional<T> = {}): T {
  const result: T = typeof json === 'string'
    ? (JSON.parse(json as string) as T)
    : json

  const keys = Object.keys(defaults) as Array<keyof T>

  for (const propertyName of keys) {
    if (result[propertyName] === undefined) {
      result[propertyName] = defaults[propertyName] as T[keyof T]
    }
  }

  return result
}

/**
 * Populates a field in a JSON to a Date object
 */
export function hydrateDate (item: Dynamic, property: string): Date {
  if (!(item[property] instanceof Date) && item[property] !== undefined) {
    return new Date(item[property] as string)
  } else {
    return item[property]
  }
}

/**
 * Populates an array in a JSON to an array of typed objects
 */
export function hydrateCollection<T extends Json> (list: T[] = [], hydrationFunction: (element: string | T) => T): T[] {
  const result = []

  for (const element of list) {
    result.push(hydrationFunction(element))
  }

  return result
}
