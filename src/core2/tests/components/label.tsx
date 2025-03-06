import { simpleContext } from "../contexts/simple"

/**
 * 
 * @returns
 */
export function Label () {
  const { a } = simpleContext.get()
  return (<p>Hello {a}</p>)
}