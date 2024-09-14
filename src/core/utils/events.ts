import { createSignal, onMount } from 'solid-js'

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
  const [hasFired, setHasFired] = createSignal(false)

  onMount(() => {
    if (!hasFired()) {
      callback();
      setHasFired(true);
    }
  });
}
