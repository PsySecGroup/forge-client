// Import SolidJS's `Setter` type, used for reactive signal updates
import { Setter } from 'solid-js'

/**
 * A utility function that detects whether the current viewport width matches
 * a mobile device breakpoint, and sets up a reactive listener to respond
 * to viewport changes.
 *
 * This is useful for implementing responsive UI behavior or conditionally
 * rendering components based on screen size (e.g., mobile vs desktop layouts).
 *
 * @param width - The maximum screen width (in pixels) considered "mobile".
 *                Defaults to `767`, a common breakpoint for phones/tablets.
 *
 * @returns An object with:
 *   - `isMobileWidth`: A boolean indicating whether the current width is mobile.
 *   - `checkMobile`: A function that accepts a SolidJS signal setter and updates
 *                    it whenever the screen crosses the mobile threshold.
 *
 * @example
 * ```ts
 * const [isMobile, setIsMobile] = createSignal(false)
 *
 * const { isMobileWidth, checkMobile } = detectMobile()
 *
 * // Initialize state
 * setIsMobile(isMobileWidth)
 *
 * // Register reactive listener
 * onCleanup(checkMobile(setIsMobile))
 * ```
 */
export function detectMobile(width = 767) {
  // Create a media query that matches when the screen is <= `width` px
  const mediaQuery = window.matchMedia(`(max-width: ${width}px)`)

  /**
   * Registers a reactive listener for screen width changes.
   *
   * @param setter - A SolidJS setter function to update a reactive signal.
   * @returns A cleanup function that removes the event listener.
   */
  const checkMobile = (setter: Setter<boolean>) => {
    const handler = (event: MediaQueryListEvent) => {
      setter(event.matches) // `true` if screen is within mobile range
    }

    // Attach the media query listener
    mediaQuery.addEventListener('change', handler)

    // Return a cleanup function (e.g., used in `onCleanup`)
    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }

  return {
    /**
     * Whether the current screen width is within the mobile threshold
     */
    isMobileWidth: window.innerWidth < width,

    /**
     * Function to track mobile width changes reactively
     */
    checkMobile
  }
}
