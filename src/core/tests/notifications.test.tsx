import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { For, render } from 'solid-js/web'
import { fireEvent } from '@testing-library/dom'
import { getNotificationActions, notificationsContext, NotificationsProvider } from '../state/notifications'
import { useContext } from 'solid-js'

async function click (query: string) {
    const button = document.querySelector(query)

    if (button) {
      await fireEvent.click(button)
    } else {
      throw new Error('Button not found')
    }
}

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

describe.only('Notifications App', () => {
  it('renders an empty list', async () => {
    const [ notifications ] = useContext(notificationsContext)

    render(() => (
      <NotificationsProvider>
        <ul>
          <For each={notifications.messages}>
            {(message) => (
              <li>
                <div>{message.text['from']}</div>
                <div>{message.text['summary']}</div>
              </li>
            )}
          </For>
        </ul>
      </NotificationsProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><ul></ul></div>`)
  })

  it('adds a message', async () => {
    const { addNotification } = getNotificationActions()
    const [ notifications ] = useContext(notificationsContext)

    render(() => (
      <NotificationsProvider>
        <ul>
          <For each={notifications.messages}>
            {(message) => (
              <li>
                <div>{message.text['from']}</div>
                <div>{message.text['summary']}</div>
              </li>
            )}
          </For>
        </ul>
        <button onClick={() => addNotification({
          id: 1,
          createdAt: new Date(),
          isNew: true,
          type: 'error' ,
          text: {
            from: 'me',
            summary: 'you broke the thing :('
          }
        })}>
            Add
          </button>
      </NotificationsProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><ul></ul><button>Add</button></div>`)

    await click('button')

    expect(document.body.innerHTML)
      .toBe(`<div id="root"><ul><li><div>me</div><div>you broke the thing :(</div></li></ul><button>Add</button></div>`)
  })
})
