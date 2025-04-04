import { type ParentProps, type JSX, createContext, batch, type Setter } from 'solid-js'
import { defineActions } from './actions'
import { StoreProvider } from './provider'
import { createLocalStore } from './localStore'

export type Navigation = {
  history: string[]
  referenceIndex: number
  location: string
}

const state: Navigation = {
  history: [],
  referenceIndex: -1,
  location: window.location.hash ? window.location.hash.substring(1) : ''
}

export const store = createLocalStore('navigation', state)

type SetState = typeof store[1]

export const NavigationContext = createContext(store)
export const NavigationStore = store
export const getNavigationActions = defineActions(store, (set: SetState) => {
  const actions =  {
    /**
     * The main location handler for Navigation
     */
    goto: (location: string, referenceIndex?: number) => {
      const history = store[0].history

      if (history[history.length - 1] !== location) {
        // The location has changed, add it

        const hash = !location
          ? '#'
          : '#' + location

        window.history.pushState({
          hash
        }, '', hash)

        batch(() => {
          set('history', history.length, location ?? '')
          set('referenceIndex', referenceIndex ?? history.length - 1)
          set('location', location ?? '')
        })        
      }
    },

    /**
     * Go back in location history an arbitrary number of steps
     */
    goBack: (stepsBack: number = 1) => {
      if (stepsBack < 1) {
        return
      }

      const { history, referenceIndex } = store[0]

      const index = referenceIndex - stepsBack < -1
        ? -1
        : referenceIndex - stepsBack


      actions.goto(history[index] as string, index)
    },

    /**
     * Go forward in location history an arbitrary number of steps
     */
    goForward: (stepsForward: number = 1) => {
      if (stepsForward < 1) {
        return
      }
      
      const { history, referenceIndex } = store[0]

      const index = referenceIndex + stepsForward > history.length - 1
        ? history.length - 1
        : referenceIndex + stepsForward

        actions.goto(history[index] as string, index)
    }
  }

  return actions
})

/**
 * Catch when Navigation events happen
 */

const { goto } = getNavigationActions()

window.addEventListener('popstate', ({ state }) => {
  console.log('popstate', { state })
  goto(state?.hash ?? state) // TODO confirm this
})

/**
 * Catch when the hash in the URL is manually changed
 */
window.addEventListener('hashchange', function (e) {
  const newHash = e.newURL.substring(e.newURL.lastIndexOf('#') + 1)
  goto(newHash) // TODO confirm this
})

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

/**
 * Context Provider
 */

export function NavigationProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={NavigationContext}
      store={NavigationStore}
    >
      {children}
    </StoreProvider>
  )
}
