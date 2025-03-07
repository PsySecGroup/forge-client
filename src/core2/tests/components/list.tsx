import { storesContext } from '../contexts/stores'

/**
 * 
 * @returns
 */
export function List () {
  const [store, actions] = storesContext.get()

  if (store === undefined) {
    return (<></>)
  }

  return (<p>Hello {store.id}</p>)
}