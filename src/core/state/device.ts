import { Setter } from 'solid-js'

/**
 * 
 * @returns 
 */
export function detectMobile (width = 767) {
  const mediaQuery = window.matchMedia(`(max-width: ${width}px)`)

  const checkMobile = (setter: Setter<boolean>) => {
    const handler = (event: MediaQueryListEvent) => {
      setter(event.matches)
    }
  
    // Listen to changes in the media query
    mediaQuery.addEventListener('change', handler)
  
    // Clean up listener when component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handler)
    }  
  }

  return {
    isMobileWidth: window.innerWidth < width,
    checkMobile
  }
}
