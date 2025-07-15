import style from './index.module.css'
import { For, onMount, onCleanup, useContext, createEffect, createSignal } from 'solid-js'
import { ConsoleContext, getConsoleActions } from '../../core/state/console'

export default function Console() {
  const [isVisible, setIsVisible] = createSignal(false)
  const [input, setInput] = createSignal('')
  let inputRef: HTMLInputElement | undefined
  let historyRef: HTMLDivElement | undefined

  const [state] = useContext(ConsoleContext)
  const { sendCommand } = getConsoleActions()

  const toggleConsole = (e: KeyboardEvent) => {
    if (e.key === '`') {
      setIsVisible(prev => !prev)
      e.preventDefault()
      // Focus input after toggle
      setTimeout(() => inputRef?.focus(), 50)
    }
  }

  const onEnter = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = input().trim()
      if (value.length > 0) {
        await sendCommand(value)
        setInput('')
      }
    }
  }

  // Auto-scroll to bottom when messages change
  createEffect(() => {
    state.messages.length // reactivity trigger
    queueMicrotask(() => {
      if (historyRef) {
        historyRef.scrollTop = historyRef.scrollHeight
      }
    })
  })

  onMount(() => {
    window.addEventListener('keydown', toggleConsole)
  })

  onCleanup(() => {
    window.removeEventListener('keydown', toggleConsole)
  })

  return (
    <div class={`${style['consoleWrapper']} ${isVisible() ? style['open'] : ''}`}>
      <div class={style['consoleContent']}>
        <div class={style['consoleHistory']} ref={historyRef}>
          <For each={state.messages}>
            {(msg) => <div class={style['consoleLine']}>{msg}</div>}
          </For>
        </div>
        <div class={style['inputWrapper']}>
          <span class={style['inputPrefix']}>&gt;</span>
          <input
            ref={inputRef}
            class={style['consoleInput']}
            type="text"
            value={input()}
            onInput={(e) => setInput(e.currentTarget.value)}
            onKeyDown={onEnter}
            placeholder="Type commands here"
          />
        </div>
      </div>
    </div>
  )
}
