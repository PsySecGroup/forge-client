import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { For, render } from 'solid-js/web'
import { getNotificationActions, NotificationsContext, NotificationsProvider } from '../state/notifications'
import { useContext } from 'solid-js'
import { drawDOM, clearDOM, click } from './utils'

beforeEach(drawDOM)
afterEach(clearDOM)

describe('Notifications App', () => {
  it('renders an empty list', async () => {
    const [ notifications ] = useContext(NotificationsContext)

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
    const [ notifications ] = useContext(NotificationsContext)

    render(() => (
      <NotificationsProvider>
        <ul>
          <For each={notifications.messages}>
            {(message) => (
              <li>
                <div>{message.text['from']}</div>
                <div>{message.text['summary']}</div>
                <div>{message.isNew ? 'new' : 'seen'}</div>
              </li>
            )}
          </For>
        </ul>
        <button id="add" onClick={() => addNotification({
          id: 1,
          createdAt: new Date(),
          isNew: false,
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
<ul><li><div>me</div><div>you broke the thing :(</div><div>seen</div></li></ul>\
<button id="add">Add</button>\
<button id="modify">Modify</button>\
<button id="remove">Remove</button>\
</div>`)

    await click('#modify')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<ul><li><div>system</div><div>you saw the error</div><div>seen</div></li></ul>\
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

  it('updates lastChecked', async () => {
    const { updateLastChecked } = getNotificationActions()
    const [ notifications ] = useContext(NotificationsContext)

    render(() => (
      <NotificationsProvider>
        <div>{
          notifications.lastChecked.toISOString().substring(0, 2)
        }</div>
        <button id="update" onClick={
          () => updateLastChecked(new Date('1/1/1999'))
        }>
          Update
        </button>
      </NotificationsProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<div>20</div>\
<button id="update">Update</button>\
</div>`)

    await click('#update')

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<div>19</div>\
<button id="update">Update</button>\
</div>`)
  })
})
