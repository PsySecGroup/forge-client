import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { drawDOM, clearDOM, click } from './utils'

beforeEach(drawDOM)
afterEach(clearDOM)

describe('Example Suite', () => {
  it ('tests a basic render', async () => {
    const [ id, setId] = createSignal('unclicked')

    render(() => (
      <button
        onClick={() => setId('clicked')}
        id={id()}
      >
        Click Me
      </button>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><button id="unclicked">Click Me</button></div>`)

    await click('#unclicked')

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><button id="clicked">Click Me</button></div>`)
    
  })
})
