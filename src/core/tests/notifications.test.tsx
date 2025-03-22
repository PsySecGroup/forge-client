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

  it('manipulates messages', async () => {
    const { addNotification, updateNotification, removeNotificationById } = getNotificationActions()
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
        <button id="add" onClick={() => addNotification({
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
        <button id="modify" onClick={() => updateNotification({
          id: 1,
          text: {
            from: 'system',
            summary: 'you saw the error'
          }
        })}>
          Modify
        </button>
        <button id="remove" onClick={() => removeNotificationById(1)}>
          Remove
        </button>
      </NotificationsProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<ul></ul>\
<button id="add">Add</button>\
<button id="modify">Modify</button>\
<button id="remove">Remove</button>\
</div>`)

    await click('#add')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<ul><li><div>me</div><div>you broke the thing :(</div></li></ul>\
<button id="add">Add</button>\
<button id="modify">Modify</button>\
<button id="remove">Remove</button>\
</div>`)

    await click('#modify')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<ul><li><div>system</div><div>you saw the error</div></li></ul>\
<button id="add">Add</button>\
<button id="modify">Modify</button>\
<button id="remove">Remove</button>\
</div>`)

    await click('#remove')

    expect(document.body.innerHTML)
    .toBe(`<div id="root">\
<ul></ul>\
<button id="add">Add</button>\
<button id="modify">Modify</button>\
<button id="remove">Remove</button>\
</div>`)
  })
})
