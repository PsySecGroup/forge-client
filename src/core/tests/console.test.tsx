import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from 'solid-js/web'
import { drawDOM, clearDOM, type, typeEnter } from './utils'
import { Command, consoleContext, ConsoleProvider, getConsoleActions } from '../state/console'
import { useContext, For } from 'solid-js'

beforeEach(drawDOM)
afterEach(clearDOM)

describe.only('Console App', () => {
  it('renders console', async () => {
    render(() => (
      <ConsoleProvider>
        <input id="promptInput" />
        <pre id="promptOutput"></pre>
        <ul id="output"></ul>
      </ConsoleProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput"></pre>\
<ul id="output"></ul>\
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
          onInput={({ target }) => updatePrompt(target.value)}
        />
        <pre id="promptOutput">{term.prompt}</pre>
        <ul id="output"></ul>
      </ConsoleProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput"></pre>\
<ul id="output"></ul>\
</div>`)

    expect(term.prompt).toBe('')
    await type('#promptInput', 'test')
    expect(term.prompt).toBe('test')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput">test</pre>\
<ul id="output"></ul>\
</div>`)
  })

  it('runs a command', async () => {
    const [ term ] = useContext(consoleContext)
    const { setCommands, updatePrompt, sendCommand } = getConsoleActions()

    const commands: Command[] = [
      {
        name: 'appendText',
        onExecute: ([ text ]) => {
          if (text === undefined) {
            return false
          }
          const result = term.prompt + text
          updatePrompt(result)
          return result
        }
      }
    ]

    expect(term.commands).toStrictEqual([])
    setCommands(commands)
    expect(term.commands).toStrictEqual([
      {
        "name": 'appendText',
        "onExecute": commands[0]?.onExecute,
        "permissions": [],
      },
    ])

    render(() => (
      <ConsoleProvider>
        <input
          id="promptInput"
          value={term.prompt}
          onInput={({ target }) => updatePrompt(target.value)}
          onKeyDown={({ key }) => key === "Enter" ? sendCommand() : false}
        />
        <pre id="promptOutput">{term.prompt}</pre>
        <ul id="output">
          <For each={term.messages}>
            {(message) => (<li>{message}</li>)}
          </For>
        </ul>
      </ConsoleProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput">test</pre>\
<ul id="output"></ul>\
</div>`)

    expect(term.prompt).toBe('test')
    await type('#promptInput', 'appendText')
    expect(term.prompt).toBe('appendText')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput">appendText</pre>\
<ul id="output"></ul>\
</div>`)

    // Send an incomplete command
    await typeEnter('#promptInput')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput">appendText</pre>\
<ul id="output"><li>Command "appendText" not found</li></ul>\
</div>`)

    // Send a complete command
    await type('#promptInput', 'appendText -complete')
    await typeEnter('#promptInput')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<input id="promptInput">\
<pre id="promptOutput"></pre>\
<ul id="output">\
<li>Command "appendText" not found</li>\
<li>appendText -complete-complete</li>\
</ul>\
</div>`)

  })
})
