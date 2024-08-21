/**
 *
 */
export const addGlobalEvent = (event: string, handler) => {
  document.addEventListener(event, handler)

  return () => {
    window.removeEventListener(event, handler)
  }
}
