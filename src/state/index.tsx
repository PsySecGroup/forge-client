import type { Optional } from '../types/common' 
import { type JSX, createContext, useContext } from 'solid-js'
import { type StoreState } from './types'
import { defaults } from './defaults'
import { getStores } from './stores'
import Actions from '../actions/index'

const storeContext = createContext<StoreState>(defaults)

export const useStoreContext = (): StoreState => useContext(storeContext)

/**
 *
 */
export const StoreProvider = (props: { children: any }): JSX.Element => {
  const stores = getStores()

  const actions = {}

  Object.keys(Actions).map(action => {
    actions[action] = () => Actions[action](stores)
  })

  // Define methods that allow modification of state from context

  return (
    <storeContext.Provider value={{
      ...stores,
      ...actions
      // Add method names above here to attach them to context
    }}>
      {props.children}
    </storeContext.Provider>
  )
}
