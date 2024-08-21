import type { Optional } from '../types/common' 
import type { StoreState } from '../../types/register'
import { type JSX, createContext, useContext } from 'solid-js'
import { defaults } from './defaults'
import { getStores } from './stores'
import Actions from '../../actions/register'
const storeContext = createContext<StoreState>(defaults)

export const useStoreContext = (): StoreState => useContext(storeContext)

/**
 *
 */
export const StoreProvider = (props: { children: any }): JSX.Element => {
  const stores = getStores()
  const actions = {}

  Object.keys(Actions).map(action => {
    actions[action] = (...args) => Actions[action](...args, stores)
  })

  return (
    <storeContext.Provider value={{
      ...stores,
      ...actions
    }}>
      {props.children}
    </storeContext.Provider>
  )
}
