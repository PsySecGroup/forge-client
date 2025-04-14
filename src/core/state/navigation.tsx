import { type ParentProps, type JSX, createContext, batch } from 'solid-js'
import { defineActions } from './actions'
import { StoreProvider } from './provider'
import { createStore } from 'solid-js/store'

export type Navigation = {
  history: string[]
  referenceIndex: number
  location: string
}

const state: Navigation = {
  history: [],
  referenceIndex: -1,
  location: window.location.hash
    ? window.location.hash.substring(1)
    : ''
}

export const store = createStore(state)

type SetState = typeof store[1]

export const NavigationContext = createContext(store)
export const NavigationStore = store
export const getNavigationActions = defineActions(store, (set: SetState) => {
  const actions =  {
    /**
     * The main location handler for Navigation
     */
    goto: (location: string, referenceIndex?: number) => {
      const destinateion = location[0] === '#'
        ? location.substring(1)
        : location

      const history = store[0].history

      if (state.location !== destinateion) {
        // The location has changed, add it

        const hash = !destinateion
          ? '#'
          : '#' + destinateion

        window.history.pushState({
          hash
        }, '', hash)
        // TODO learn more about pushstate to make sure back and forward buttons work

        batch(() => {
          set('history', history.length, destinateion ?? '')
          set('referenceIndex', referenceIndex ?? history.length - 1)
          set('location', destinateion ?? '')
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
  if (state) {
    goto(state.hash.substring(state.hash.lastIndexOf('#')))
  }
})

/**
 * Catch when the hash in the URL is manually changed
 */
window.addEventListener('hashchange', function (e) {
  goto(e.newURL.substring(e.newURL.lastIndexOf('#')))
})

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
