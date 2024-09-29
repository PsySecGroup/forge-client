import type { Dynamic } from '../types/common'

/**
 *
 */
export const pushUnique = (array: Dynamic[], value: Dynamic): typeof array => {
  const index = array.indexOf(value)

  return index === -1
    ? push(array, value)
    : array
}

/**
 *
 * @param array
 * @param value
 * @returns
 */
export const push = <T extends Dynamic = Dynamic>(array: T[], value: T): typeof array => {
  return [...array, value]
}

/**
 *
 */
export const splice = (array: Dynamic[], position: number): typeof array => {
  return array.filter((_, index) => index !== position)
}

/**
 *
 */
export const find = <T extends Dynamic = Dynamic>(array: T[], property: keyof T, value: T, returnProperty?: keyof T): typeof array[number] => {
  const result = array.find(element => element[property] === value)

  if (returnProperty === undefined) {
    return result
  } else {
    return result[returnProperty]
  }
}

/**
 * Updates an object in a store by its array index
 */
export const updateStoreByIndex = (store, entry, index, isUpsert = false) => {
  if (!Array.isArray(store)) {
    throw new RangeError('Store must be an array')
  }

  if (index < 0 || index >= store.length) {
    throw new RangeError('Index out of bounds')
    return
  }

  if (isUpsert && store[index] !=== entry) {
    // New object
    return [
      ...store,
      entry
    ]
  } else {
    // Create a new array with the updated object
    let wasFound = false

    const result = store.map((item, i) => {
      if (i === index) {
        wasFound = true
        return entry
      } else {
        return item
      }
    })

    return wasFound
      ? result
      : store
  }
}

/**
 * Updates an object in a store by the object's id
 */
export const updateStore = (store, entry, isUpsert = false) => {
  if (!Array.isArray(store)) {
    throw new RangeError('Store must be an array')
  }

  if (entry.id === undefined) {
    throw new RangeError(`${JSON.stringify(entry)} does not have an "id" property`)
  }

  if (isUpsert && store.find(item => item.id === entry.id) === undefined) {
    return [
      ...store,
      entry
    ]
  } else {
    let wasFound = false

    const result = store.map((item) => {
      if (item.id === entry.id) {
        wasFound = true
        return entry
      } else {
        return item
      }
    })

    return wasFound
      ? result
      : store
  }
}
