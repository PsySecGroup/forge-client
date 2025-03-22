import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { App } from './exampleApp/app'
import { fireEvent } from '@testing-library/dom'
import { Counter } from './exampleApp/counter'
import { Forms } from './exampleApp/forms'
import { exampleContext, exampleStore } from './exampleApp/state'
import { formsContext, formsStore } from './exampleApp/formsState'
import { drawDOM, clearDOM, click } from './utils'

beforeEach(drawDOM)
afterEach(clearDOM)

describe('Example App', () => {
  it('renders counter', async () => {
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

    // Find the button and click it
    await click('button')

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div>2<button>Increment</button></div></div>`)
  })

  it('renders forms', async () => {
    // The localStorage WILL be populated BEFORE the render!
    expect(localStorage.getItem('forms'))
      .toBe(`{"name":"default"}`)

    render(() => (
      <App
        context={formsContext}
        store={formsStore}
      >
        <Forms />
      </App>
    ), document.getElementById('root')!)

    expect(localStorage.getItem('forms'))
      .toBe(`{"name":"default"}`)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><span>default</span><input></div>`)

    expect(localStorage.getItem('forms'))
      .toBe(`{"name":"default"}`)

    const input = document.querySelector('input')

    if (input) {
      fireEvent.input(input, { target: { value: 'New Name' } });
    } else {
      throw new Error('Input not found')
    }

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><span>New Name</span><input></div>`)

    expect(localStorage.getItem('forms'))
      .toBe(`{"name":"New Name"}`)
  })
})
