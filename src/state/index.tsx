import { type JSX, createContext, useContext } from 'solid-js'
import { type Space } from '../types/space'
import { type GraphMessage } from '../types/graphMessage'
import { type GraphView, type StoreState } from './types'
import { defaults } from './defaults'
import { getStores } from './stores'

const storeContext = createContext<StoreState>(defaults)

export const useStoreContext = (): StoreState => useContext(storeContext)

/**
 *
 */
function getGraphView (graphViews: GraphView[], spaceId: number): GraphView | undefined {
  return graphViews.find(graphView => graphView.spaceId === spaceId)
}

export const StoreProvider = (props: { children: any }): JSX.Element => {
  const stores = getStores()
  let graphMessageId = 0

  /**
   *
   */
  const registerGraphView = (spaceId: number, iframe: HTMLIFrameElement): void => {
    const graphView = getGraphView(stores.graphViews, spaceId)

    if (graphView !== undefined) {
      // Don't allow multiple registering of graph views for a space
      return
    }

    // Add the graph view to the space
    stores.setGraphViews([...stores.graphViews, { spaceId, iframe }])

    window.addEventListener('message', (event: MessageEvent<string>) => {
      const graphView = getGraphView(stores.graphViews, spaceId)

      if (graphView === undefined) {
        return
      }

      if (iframe?.contentWindow !== null && event.source === iframe?.contentWindow) {
        const graphMessage: GraphMessage = JSON.parse(event.data)
        stores.setGraphMessages([...stores.graphMessages, graphMessage])
      }
    })
  }

  /**
   *
   */
  const sendGraphMessage = (graphMessage: GraphMessage): number => {
    const graphView = getGraphView(stores.graphViews, graphMessage.spaceId)

    if (graphView === undefined) {
      return -1
    }

    graphMessage.id = graphMessageId
    graphView.iframe?.contentWindow?.postMessage(JSON.stringify(graphMessage), '*')

    const result = graphMessageId
    graphMessageId += 1
    return result
  }

  /**
   *
   */
  const updateFocusedSpace = (newValue: Partial<Space>): void => {
    const index = stores.spaces.findIndex(space => space.isFocused)

    if (index > -1) {
      stores.setSpaces(index, newValue)
    }
  }

  /**
   *
   */
  const getFocusedSpace = (): Space => {
    const index = stores.spaces.findIndex(space => space.isFocused)

    return stores.spaces[index]
  }

  /**
   *
   */
  const getFocusedSpaceIndex = (): number => {
    return stores.spaces.findIndex(space => space.isFocused)
  }

  return (
    <storeContext.Provider value={{
      ...stores,
      updateFocusedSpace,
      getFocusedSpace,
      getFocusedSpaceIndex,
      registerGraphView,
      sendGraphMessage
    }}>
      {props.children}
    </storeContext.Provider>
  )
}
