import { type ParentProps, type JSX, createContext, batch } from 'solid-js'
import { getActions } from './actions'
import { StoreProvider } from './provider'
import { createLocalStore } from './localStore'

export type Navigation = {
  history: string[]
  referenceIndex: number
}

const state: Navigation = {
  history: [],
  referenceIndex: -1
}

export const store = createLocalStore('navigation', state)

type SetState = typeof store[1]

export const navigationContext = createContext(store)
export const navigationStore = store
export const getNavigationActions = getActions(store, (set: SetState) => {
  const actions =  {
    /**
     * Get the current page
     */
    getPage: () => {
      const history = store[0].history
      return history[history.length - 1]
    },

    /**
     * The main location handler for Navigation
     */
    goto: (page: string, referenceIndex?: number) => {
      const history = store[0].history

      if (history[history.length - 1] !== page) {
        // The location has changed, add it

        const hash = !page
          ? '#'
          : '#' + page

        window.history.pushState({
          hash
        }, '', hash)

        batch(() => {
          set('history', history.length, page ?? '')
          set('referenceIndex', referenceIndex ?? history.length - 1)
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
  goto(state?.hash ?? state) // TODO confirm this
})

/**
 * Catch when the hash in the URL is manually changed
 */
window.addEventListener('hashchange', function () {
  goto((this.window.location.hash || '').substring(1)) // TODO confirm this
})

/**
 * Context Provider
 */

export function NavigationProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={navigationContext}
      store={navigationStore}
    >
      {children}
    </StoreProvider>
  )
}
