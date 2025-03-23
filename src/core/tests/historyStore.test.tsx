import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { App } from './exampleApp/app'
import { exampleContext, exampleStore } from './exampleApp/state'
import { drawDOM, clearDOM } from './utils'

beforeEach(drawDOM)
afterEach(clearDOM)

describe.skip('HistoryStore App', () => {
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
