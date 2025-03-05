import type { Any, DynamicFunction } from '../types'

/**
 * Manually waits for updates to stop for an amount of time before the state updates
 */
export function debounce(fn: DynamicFunction, delay: number) {
  let timeout: number

  return (...args: Any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Update the state then wait a delayed amount of time before we update it again
 */
export function throttle(fn: DynamicFunction, limit: number) {
  let inThrottle: boolean
  return (...args: Any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
