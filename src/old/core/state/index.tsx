import type { Any } from '../types'
import { type StoreState } from '../../state/register'
import { type ParentProps, type JSX, createContext, useContext } from 'solid-js'
import { defaults } from './defaults'
import { getStores } from './stores'
import Actions from '../../actions/register'

const storeContext = createContext<StoreState>(defaults)

export const useStoreContext = (): StoreState => useContext(storeContext)

type Props = {}

/**
 * TODO name this
 */
export const StoreProvider = (props: ParentProps<Props>): JSX.Element => {
  const stores = getStores()
  const actions = {} as StoreState

  Object.keys(Actions).map((action) => {
    // TODO probably have to reevaluate what this all means
    actions[action as keyof StoreState] = (...args: Any[]) => Actions[action](...args, stores)
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
