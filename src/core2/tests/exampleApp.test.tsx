import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from 'solid-js/web'
import { App } from './exampleApp/app'
import { Counter } from './exampleApp/counter'
import { exampleContext, exampleStore } from './exampleApp/state'

beforeEach(() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
})

afterEach(() => {
  const root = document.getElementById('root')
  if (root) {
    document.body.removeChild(root)
  }
})

describe('Example App', () => {
  it('renders complex context', () => {
    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <Counter />
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div>1<button>Increment</button></div></div>`)
  })
})
