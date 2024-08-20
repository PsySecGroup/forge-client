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
