import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { For, render } from 'solid-js/web'
// import { fireEvent } from '@testing-library/dom'
import { getNotificationActions, notificationsContext, NotificationsProvider } from '../state/notifications'
import { useContext } from 'solid-js'

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
  it('renders console', async () => {
    const {} = getNotificationActions
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
})
