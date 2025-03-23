import { describe, it, expect, beforeEach, afterEach,  } from 'vitest'
import { render } from 'solid-js/web'
import { drawDOM, clearDOM, click } from './utils'
import { useContext } from 'solid-js'
import { NavigationContext } from '../state/navigation'
import { NavigationCompoonent } from './exampleApp/navigation'

beforeEach(drawDOM)
afterEach(clearDOM)

const navigationHtml = `<div id="root">\
<button id="gotoA"></button>\
<button id="gotoB"></button>\
<button id="gotoC"></button>\
<button id="back1"></button>\
<button id="back2"></button>\
<button id="back3"></button>\
<button id="forward1"></button>\
<button id="forward2"></button>\
<button id="forward3"></button>\
</div>`

describe('Navigation App', () => {
  it('renders navigation', async () => {
    render(() => <NavigationCompoonent />, document.getElementById('root')!)

    expect(document.body.innerHTML).toBe(navigationHtml)
  })

  it('performs simple Goto navigation', async () => {
    const [ navigation ] = useContext(NavigationContext)

    render(() => <NavigationCompoonent />, document.getElementById('root')!)

    expect(document.body.innerHTML).toBe(navigationHtml)
    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({history: [], referenceIndex: -1, location: '' })

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A' ], referenceIndex: 0, location: 'A' })
  })

  it('performs simple Back navigation', async () => {
    const [ navigation ] = useContext(NavigationContext)

    render(() => <NavigationCompoonent />, document.getElementById('root')!)

    expect(document.body.innerHTML).toBe(navigationHtml)
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A' ], referenceIndex: 0, location: 'A' })    

    await click('#back1')
    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({ history: [ 'A', '' ], location: '', referenceIndex: -1 })
  })


  it('performs simple Forward navigation', async () => {
    const [ navigation ] = useContext(NavigationContext)

    render(() => <NavigationCompoonent />, document.getElementById('root')!)

    expect(document.body.innerHTML).toBe(navigationHtml)

    expect(window.location.hash).toBe('')
    expect(navigation).toStrictEqual({ history: [ 'A', '' ], referenceIndex: -1, location: '' })

    await click('#forward1')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ history: [ 'A', '', 'A' ], referenceIndex: 0, location: 'A' })
    
  })

  it('performs complex testing', async () => {
    const [ navigation ] = useContext(NavigationContext)

    render(() => <NavigationCompoonent />, document.getElementById('root')!)

    expect(document.body.innerHTML).toBe(navigationHtml)
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A' ],
      referenceIndex: 0,
      location: 'A'
    })

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A' ],
      referenceIndex: 0,
      location: 'A'
    })

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A' ],
      referenceIndex: 0,
      location: 'A'
    })

    await click('#gotoB')
    expect(window.location.hash).toStrictEqual('#B')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B' ],
      referenceIndex: 3,
      location: 'B'
    })

    await click('#gotoC')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C' ],
      referenceIndex: 4,
      location: 'C'
    })

    await click('#back1')
    expect(window.location.hash).toStrictEqual('#B')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B' ],
      referenceIndex: 3,
      location: 'B'
    })

    await click('#back2')
    expect(window.location.hash).toStrictEqual('')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '' ],
      referenceIndex: 1,
      location: ''
    })

    await click('#forward3')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C' ],
      referenceIndex: 4,
      location: 'C'
    })

    await click('#gotoA')
    expect(window.location.hash).toStrictEqual('#A')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C', 'A' ],
      referenceIndex: 8,
      location: 'A'
    })

    await click('#back1')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({ 
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C', 'A', 'C' ],
      referenceIndex: 7,
      location: 'C'
    })

    await click('#back3')
    expect(window.location.hash).toStrictEqual('#C')
    expect(navigation).toStrictEqual({
      history: [ 'A', '', 'A', 'B', 'C', 'B', '', 'C', 'A', 'C' ],
      referenceIndex: 7,
      location: 'C'
    })
  })
})
