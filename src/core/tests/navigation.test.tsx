import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { App } from './exampleApp/app'
// import { fireEvent } from '@testing-library/dom'
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

describe.skip('Navigation App', () => {
  it('renders console', async () => {
    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >

      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"></div>`)
  })
})
