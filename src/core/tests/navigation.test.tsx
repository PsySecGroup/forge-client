import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { drawDOM, clearDOM, click } from './utils'
import { useContext } from 'solid-js'
import { getNavigationActions, navigationContext, NavigationProvider } from '../state/navigation'

beforeEach(drawDOM)
afterEach(clearDOM)

describe.only('Navigation App', () => {
  it('renders navigation', async () => {
    render(() => (
      <NavigationProvider>
        <button id="gotoA" />
      </NavigationProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<button id="gotoA"></button>\
</div>`)
  })

  it('performs simple Goto navigation', async () => {
    const [ navigation ] = useContext(navigationContext)
    const { goto } = getNavigationActions()

    render(() => (
      <NavigationProvider>
        <button
          id="gotoA"
          onClick={() => goto('A')}
        />
      </NavigationProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<button id="gotoA"></button>\
</div>`)
    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({ history: [], referenceIndex: -1 })
    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A' ], referenceIndex: 0 })
  })

  it('performs simple Back navigation', async () => {
    const [ navigation ] = useContext(navigationContext)
    const { goBack } = getNavigationActions()

    render(() => (
      <NavigationProvider>
        <button
          id="back1"
          onClick={() => goBack()}
        />
      </NavigationProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<button id="back1"></button>\
</div>`)
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A' ], referenceIndex: 0 })    
    await click('#back1')
    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({ history: [ 'A', '' ], referenceIndex: -1 })
  })


  it('performs simple Forward navigation', async () => {
    const [ navigation ] = useContext(navigationContext)
    const { goForward } = getNavigationActions()

    render(() => (
      <NavigationProvider>
        <button
          id="forward1"
          onClick={() => goForward()}
        />
      </NavigationProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<button id="forward1"></button>\
</div>`)

    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({ history: [ 'A', '' ], referenceIndex: -1 })
    await click('#forward1')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A', '', 'A' ], referenceIndex: 0 })
    
  })

  it('complex testing', async () => {
    const [ navigation ] = useContext(navigationContext)
    const { goto, goBack, goForward, getPage } = getNavigationActions()

    render(() => (
      <NavigationProvider>
        <button id="gotoA" onClick={() => goto('A')} />
        <button id="gotoB" onClick={() => goto('B')} />
        <button id="gotoC" onClick={() => goto('C')} />
        <button id="back1" onClick={() => goBack(1)} />
        <button id="back2" onClick={() => goBack(2)} />
        <button id="back3" onClick={() => goBack(3)} />
        <button id="forward1" onClick={() => goForward(1)} />
        <button id="forward2" onClick={() => goForward(2)} />
        <button id="forward3" onClick={() => goForward(3)} />
      </NavigationProvider>
    ), document.getElementById('root')!)

    expect(document.body.innerHTML)
      .toBe(`<div id="root">\
<button id="gotoA"></button>\
<button id="gotoB"></button>\
<button id="gotoC"></button>\
<button id="back1"></button>\
<button id="back2"></button>\
<button id="back3"></button>\
<button id="forward1"></button>\
<button id="forward2"></button>\
<button id="forward3"></button>\
</div>`)
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A' ],
      referenceIndex: 0
    })
    expect(getPage()).toBe('A')

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A' ],
      referenceIndex: 0
    })
    expect(getPage()).toBe('A')

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A' ],
      referenceIndex: 0
    })
    expect(getPage()).toBe('A')

    await click('#gotoB')
    expect(window.location.hash).toStrictEqual('#B')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B' ],
      referenceIndex: 3
    })
    expect(getPage()).toBe('B')

    await click('#gotoC')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C' ],
      referenceIndex: 4
    })
    expect(getPage()).toBe('C')

    await click('#back1')
    expect(window.location.hash).toStrictEqual('#B')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B' ],
      referenceIndex: 3
    })
    expect(getPage()).toBe('B')

    await click('#back2')
    expect(window.location.hash).toStrictEqual('')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '' ],
      referenceIndex: 1
    })
    expect(getPage()).toBe('')

    await click('#forward3')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C' ],
      referenceIndex: 4
    })
    expect(getPage()).toBe('C')

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C', 'A' ],
      referenceIndex: 8
    })
    expect(getPage()).toBe('A')

    await click('#back1')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C', 'A', 'C' ],
      referenceIndex: 7
    })
    expect(getPage()).toBe('C')

    await click('#back3')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C', 'A', 'C' ],
      referenceIndex: 7
    })
    expect(getPage()).toBe('C')
  })
})
