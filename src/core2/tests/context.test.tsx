import { render } from 'solid-js/web'
import { registerContext } from '../state/context'
import { StateProvider } from '../state/provider'
import { describe, it, expect, beforeEach } from 'vitest'

const testContext = registerContext('bob', { a: 7 })

/**
 * 
 * @returns
 */
function Label () {
  const { a } = testContext.getContext()
  return (<p>Hello {a}</p>)
}

beforeEach(() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
})

describe('Context Provider', () => {
  it('renders without crashing', () => {
    render(() => (
      <StateProvider context={testContext}>
        <Label />
      </StateProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML).toBe(`<div id="root"><p>Hello 7</p></div>`)
  })
})
