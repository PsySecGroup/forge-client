import { simpleContext } from '../contexts/simple'

/**
 * 
 * @returns
 */
export function Label () {
  const [ store ] = simpleContext.get()
  return (<p>Hello {store.a}</p>)
}