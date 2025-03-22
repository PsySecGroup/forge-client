import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { App } from './exampleApp/app'
import { fireEvent } from '@testing-library/dom'
import { exampleContext, exampleStore } from './exampleApp/state'
import { ThemeProvider } from '../themes'
import { getThemeActions } from '../themes/state'
import { ThemedBox } from './exampleApp/themedBox'
import otherCss from './exampleApp/other.module.css'

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

describe('Themed App', () => {
  it ('render themes', async () => {
    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <ThemeProvider>
          <ThemedBox />
        </ThemeProvider>
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div class="_container_f5f486" style="background: rgb(9, 14, 16);">\
<h1 class="_header_f5f486" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1>\
</div></div>`)
  })

  it ('render themes with true class props', async () => {
    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <ThemeProvider>
          <ThemedBox
            classes={{
              container: otherCss['container']!
            }}
          />
        </ThemeProvider>
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<div class="_container_57cb44" style="background: rgb(9, 14, 16);">\
<h1 class="_header_f5f486" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1>\
</div></div>`)
  })

  it ('render themes with false class props', async () => {
    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <ThemeProvider>
          <ThemedBox
            classes={{
              container: false,
            }}
          />
        </ThemeProvider>
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div class="_container_f5f486" style="background: rgb(9, 14, 16);">\
<h1 class="_header_f5f486" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1>\
</div></div>`)
  })

  it('render themes with mixed class props', async () => {
    const showContainer = false

    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <ThemeProvider>
          <ThemedBox
            classes={{
              container: () => showContainer ? otherCss['container']! : false,
              header: otherCss['header']!
            }}
          />
        </ThemeProvider>
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div class="_container_f5f486" style="background: rgb(9, 14, 16);">\
<h1 class="_header_57cb44" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1>\
</div></div>`)
  })

  it ('render styles', async () => {
    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <ThemeProvider>
          <ThemedBox style={{
            container: {
              background: 'white'
            }
          }}/>
        </ThemeProvider>
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div class="_container_f5f486" style="background: white;">\
<h1 class="_header_f5f486" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1>\
</div></div>`)
  })

  it('changes themes upon click', async () => {
    const showContainer = false
    const { setTheme } = getThemeActions()

    render(() => (
      <App
        context={exampleContext}
        store={exampleStore}
      >
        <ThemeProvider>
          <ThemedBox
            classes={{
              container: () => showContainer ? otherCss['container']! : false,
              header: otherCss['header']!
            }}
          />
          <button onClick={() => setTheme({
            primary: {
              background: '#00FF00'
            }
          })}>
            Change
          </button>
        </ThemeProvider>
      </App>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div class="_container_f5f486" style="background: rgb(9, 14, 16);">\
<h1 class="_header_57cb44" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1></div>\
<button>Change</button>\
</div>`)

    // Find the button and click it
    const button = document.querySelector('button')

    if (button) {
      await fireEvent.click(button)
    } else {
      throw new Error('Button not found')
    }

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><div class="_container_f5f486" style="background: rgb(0, 255, 0);">\
<h1 class="_header_57cb44" style="background: rgb(148, 166, 184);">\
Hello, Solid!\
</h1></div>\
<button>Change</button>\
</div>`)
  })
})
