import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from 'solid-js/web'
import { simpleContext } from './contexts/simple'
import { Label } from './components/label'
import { App } from './components/app'
import { storesContext } from './contexts/stores'
import { completeContext } from './contexts/complete'
import { List } from './components/list'

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

describe('Context Provider', () => {
  it('renders simple context', () => {
    render(() => (
      <App context={simpleContext}>
        <Label />
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><p>Hello 7</p></div>`)
  })

  it('renders stores context', () => {
    render(() => (
      <App context={storesContext}>
        <List />
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><p>Hello 1</p></div>`)
  })

  it('renders complete context', () => {
    render(() => (
      <App context={completeContext}>
      </App>
    ), document.getElementById('root')!)

    // expect(document.body.innerHTML)
    //   .toBe(`<div id="root"><p>Hello 7</p></div>`)
  })
})
