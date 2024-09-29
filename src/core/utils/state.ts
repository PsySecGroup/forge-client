/**
 * Manually waits for updates to stop for an amount of time before the state updates
 */
export function debounce(fn: Function, delay: number) {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Update the state then wait a delayed amount of time before we update it again
 */
export function throttle(fn: Function, limit: number) {
  let inThrottle: boolean
  return (...args: any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
