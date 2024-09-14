import { createSignal, onMount, onCleanup } from 'solid-js'

const firedCallbacks = new WeakMap<any, boolean>();

/**
 *
 */
export const addGlobalEvent = (event: string, handler) => {
  document.addEventListener(event, handler)

  return () => {
    window.removeEventListener(event, handler)
  }
}

/**
 *
 */
export function fireOnce(callback: () => void) {
  // Use the component instance itself (this function scope) as the key
  if (!firedCallbacks.has(fireOnce)) {
    firedCallbacks.set(fireOnce, true) // Mark this instance as having fired
    callback() // Execute the callback
  }

  // Optionally, clean up the WeakMap entry when the component is unmounted
  onCleanup(() => {
    firedCallbacks.delete(fireOnce) // Remove the entry to allow re-firing if re-mounted
  })
}