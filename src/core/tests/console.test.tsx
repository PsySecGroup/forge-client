import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { drawDOM, clearDOM, type } from './utils'
import { consoleContext, ConsoleProvider, getConsoleActions } from '../state/console'
import { useContext } from 'solid-js'

beforeEach(drawDOM)
afterEach(clearDOM)

describe.only('Console App', () => {
  it('renders console', async () => {
    render(() => (
      <ConsoleProvider>
        <input id="promptInput" />
        <pre id="promptOutput"></pre>
        <div id="output"></div>
      </ConsoleProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput"></pre>\
<div id="output"></div>\
</div>`)
  })

  it('adds to the prompt', async () => {
    const [ term ] = useContext(consoleContext)
    const { updatePrompt } = getConsoleActions()

    render(() => (
      <ConsoleProvider>
        <input
          id="promptInput"
          value={term.prompt}
          onInput={({ target }) => {
            const { value } = target
            updatePrompt(value)
          }}
        />
        <pre id="promptOutput">{term.prompt}</pre>
        <div id="output"></div>
      </ConsoleProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput"></pre>\
<div id="output"></div>\
</div>`)

    expect(term.prompt, '')
    await type('#promptInput', 'test')
    expect(term.prompt, 'test')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput">test</pre>\
<div id="output"></div>\
</div>`)
  })
})
