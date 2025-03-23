import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { drawDOM, clearDOM, click } from './utils'
import { ForgeApp } from '../app'
import { getNavigationActions, NavigationContext } from '../state/navigation'
import { ConsoleCommandArgs, ConsoleContext, getConsoleActions } from '../state/console'
import { getNotificationActions, NotificationsContext } from '../state/notifications'
import { getThemeActions, ThemeContext } from '../themes/state'
import { For, useContext } from 'solid-js'

beforeEach(drawDOM)
afterEach(clearDOM)

describe('ForgeApp App', () => {
  it('renders ForgeApp', async () => {
    const [ navigation ] = useContext(NavigationContext)
    const [ term ] = useContext(ConsoleContext)
    const [ theme ] = useContext(ThemeContext)
    const [ notifications ] = useContext(NotificationsContext)

    const { goto } = getNavigationActions()
    const { sendCommand } = getConsoleActions()
    const { addNotification } = getNotificationActions()
    const { setTheme } = getThemeActions()

    const consoleCommands = [{
      name: 'goto',
      onExecute: (args: ConsoleCommandArgs) => {
        const [ location ] = args as [string]
        if(location === '') {
          return false
        }

        goto(location)

        return 'Going to ' + location
      }
    }]

    const sendNotification = () => addNotification({
      id: 1,
      text: {
        message: 'a message!'
      },
      type: 'message'
    })

    const changeTheme = () => setTheme({
      primary: {
        background: 'black'
      }
    })

    render(() => (
      <ForgeApp
        consoleCommands={consoleCommands}
      >
        <p style={theme.primary}>Current Page: {navigation.location}</p>
        <button id="gotoA" onClick={() => goto('A')}/>
        <button id="fireConsole" onClick={() => sendCommand('goto B')} />
        <button id="sendNotification" onClick={sendNotification} />
        <button id="changeTheme" onClick={changeTheme}/>
        <ul id="consoleOutput">
          <For each={term.messages}>
            {(message) => (<li>{message}</li>)}
          </For>
        </ul>
        <ul>
          <For each={notifications.messages}>
            {(message) => (
              <li>
                <div>{message.text['message']}</div>
              </li>
            )}
          </For>
        </ul>
      </ForgeApp>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<p style="background: rgb(9, 14, 16);">Current Page: </p>\
<button id="gotoA"></button>\
<button id="fireConsole"></button>\
<button id="sendNotification"></button>\
<button id="changeTheme"></button>\
<ul id="consoleOutput"></ul>\
<ul></ul>\
</div>`)

    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({history: [], referenceIndex: -1, location: '' })
    
    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A' ], referenceIndex: 0, location: 'A' })
    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<p style="background: rgb(9, 14, 16);">Current Page: A</p>\
<button id="gotoA"></button>\
<button id="fireConsole"></button>\
<button id="sendNotification"></button>\
<button id="changeTheme"></button>\
<ul id="consoleOutput"></ul>\
<ul></ul>\
</div>`)

    await click('#fireConsole')
    expect(window.location.hash).toStrictEqual('#B')
    expect(navigation).toStrictEqual({ history: [ 'A', 'B' ], referenceIndex: 1, location: 'B' })
    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<p style="background: rgb(9, 14, 16);">Current Page: B</p>\
<button id="gotoA"></button>\
<button id="fireConsole"></button>\
<button id="sendNotification"></button>\
<button id="changeTheme"></button>\
<ul id="consoleOutput">\
<li>goto B</li>\
<li>Going to B</li>\
</ul>\
<ul></ul>\
</div>`)

    await click('#sendNotification')
    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<p style="background: rgb(9, 14, 16);">Current Page: B</p>\
<button id="gotoA"></button>\
<button id="fireConsole"></button>\
<button id="sendNotification"></button>\
<button id="changeTheme"></button>\
<ul id="consoleOutput">\
<li>goto B</li>\
<li>Going to B</li>\
</ul>\
<ul>\
<li><div>a message!</div></li>\
</ul>\
</div>`)

    await click('#changeTheme')
    expect(document.body.innerHTML)
    .toBe(`<div id="root">\
<p style="background: black;">Current Page: B</p>\
<button id="gotoA"></button>\
<button id="fireConsole"></button>\
<button id="sendNotification"></button>\
<button id="changeTheme"></button>\
<ul id="consoleOutput">\
<li>goto B</li>\
<li>Going to B</li>\
</ul>\
<ul>\
<li><div>a message!</div></li>\
</ul>\
</div>`)
  })
})
