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
  referenceIndex: 0
}

export const store = createLocalStore('navigation', state)

type SetState = typeof store[1]

export const navigationContext = createContext(store)
export const navigationStore = store
export const getNotificationActions = getActions(store, (set: SetState) => {
  const actions =  {
    /**
     * The main location handler for Navigation
     */
    goto: (page: string, referenceIndex?: number) => {
      const history = store[0].history

      if (history[history.length - 1] !== page) {
        // The location has changed, add it

        set('history', history.length, page)
        set('referenceIndex', referenceIndex ?? history.length)

        window.history.pushState({}, '', '#' + page)
      }
    },

    /**
     * Go back in location history an arbitrary number of steps
     */
    goBack: (stepsBack: number = -1) => {
      if (stepsBack > -1) {
        return
      }

      const { history, referenceIndex } = store[0]

      const index = referenceIndex - stepsBack < 0
        ? 0
        : referenceIndex - stepsBack

      actions.goto(history[index] as string, index)
    },

    /**
     * Go forward in location history an arbitrary number of steps
     */
    goForward: (stepsForward: number = 1) => {
      if (stepsForward > -1) {
        return
      }

      const history = store[0].history
      const index = history.length - stepsForward < 0
        ? 0
        : history.length - stepsForward


      actions.goto(history[index] as string)
    }
  }

  return actions
})

/**
 * Catch when Navigation events happen
 */

const { goto } = getNotificationActions()

window.addEventListener('popstate', ({ state }) => {
  goto(state as string)
})

/**
 * Catch when the hash in the URL is manually changed
 */
window.addEventListener('hashchange', function () {
  goto(this.window.location.hash)
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
