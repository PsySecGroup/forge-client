import { type JSX, createContext, useContext } from 'solid-js'
import { type Space } from '../types/space'
import { type GraphMessage } from '../types/graphMessage'
import { type GraphView, type StoreState } from './types'
import { defaults } from './defaults'
import { getStores } from './stores'

const storeContext = createContext<StoreState>(defaults)

export const useStoreContext = (): StoreState => useContext(storeContext)

export const StoreProvider = (props: { children: any }): JSX.Element => {
  const stores = getStores()

  // Define methods that allow modification of state from context

  return (
    <storeContext.Provider value={{
      ...stores,
      // Add method names above here to attach them to context
    }}>
      {props.children}
    </storeContext.Provider>
  )
}
