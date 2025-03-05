import type { Any, RecordKey, DynamicRecord } from '../types'

function isPlainObject(value: Any): value is DynamicRecord {
  return value !== null && typeof value === 'object' && value.constructor === Object
}

/**
 * TODO name this
 */
export const pushUnique = (array: Any[], value: Any): typeof array => {
  const index = array.indexOf(value)

  return index === -1
    ? push(array, value)
    : array
}

/**
 * TODO name this
 * @param array
 * @param value
 * @returns
 */
export const push = <T extends Any = Any>(array: T[], value: T): typeof array => {
  return [...array, value]
}

/**
 * TODO name this
 */
export const splice = (array: Any[], position: number): typeof array => {
  return array.filter((_, index) => index !== position)
}

/**
 * TODO name this
 */
export const find = <T extends Any = Any>(array: T[], property: keyof T, value: T): typeof array[number] | undefined => {
  return array.find(element => {
    if (element) {
      // Check if element is a Map
      if (element instanceof Map) {
        return element.get(property) === value
      } else if (typeof element === "object") {
        if (Array.isArray(element)) {
          // Arrays use numeric indices
          return element[property as number] === value
        } else if (isPlainObject(element)) {
          // Objects and DynamicRecords
          return (element as DynamicRecord)[property as RecordKey] === value
        }
      }
    }

    return element === value
  })
}

/**
 * TODO name this
//  */
// export const updateStoreByIndex = (store, entry, index, isUpsert = false) => {
//   if (!Array.isArray(store)) {
//     throw new RangeError('Store must be an array')
//   }

//   if (index < 0 || index >= store.length) {
//     throw new RangeError('Index out of bounds')
//   }

//   if (isUpsert && store[index] !== entry) {
//     // New object
//     return [
//       ...store,
//       entry
//     ]
//   } else {
//     // Create a new array with the updated object
//     let wasFound = false

//     const result = store.map((item, i) => {
//       if (i === index) {
//         wasFound = true
//         return entry
//       } else {
//         return item
//       }
//     })

//     return wasFound
//       ? result
//       : store
//   }
// }

/**
 * TODO name this
 */
// export const updateStore = (store, entry, isUpsert = false) => {
//   if (!Array.isArray(store)) {
//     throw new RangeError('Store must be an array')
//   }

//   if (entry.id === undefined) {
//     throw new RangeError(`${JSON.stringify(entry)} does not have an "id" property`)
//   }

//   if (isUpsert && store.find(item => item.id === entry.id) === undefined) {
//     return [
//       ...store,
//       entry
//     ]
//   } else {
//     let wasFound = false

//     const result = store.map((item) => {
//       if (item.id === entry.id) {
//         wasFound = true
//         return entry
//       } else {
//         return item
//       }
//     })

//     return wasFound
//       ? result
//       : store
//   }
// }
