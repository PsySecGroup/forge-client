import style from './index.module.css'
import { For, onMount, onCleanup, useContext, createEffect, createSignal } from 'solid-js'
import { ConsoleContext, getConsoleActions } from '../../core/state/console'

export default function Console() {
  const [isVisible, setIsVisible] = createSignal(false)
  const [input, setInput] = createSignal('')
  const [history, setHistory] = createSignal<string[]>([])
  const [historyIndex, setHistoryIndex] = createSignal<number | null>(null)

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
        setHistory(prev => [...prev, value])
        setInput('')
        setHistoryIndex(null)
      }
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const hist = history()
    const index = historyIndex()

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hist.length === 0) return

      if (index === null) {
        const lastCommand = hist[hist.length - 1]
        if (lastCommand !== undefined) {
          setHistoryIndex(hist.length - 1)
          setInput(lastCommand)
        }
      } else if (index > 0) {
        const prevCommand = hist[index - 1]
        if (prevCommand !== undefined) {
          setHistoryIndex(index - 1)
          setInput(prevCommand)
        }
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (index === null) return

      if (index < hist.length - 1) {
        const nextCommand = hist[index + 1]
        if (nextCommand !== undefined) {
          setHistoryIndex(index + 1)
          setInput(nextCommand)
        }
      } else {
        // Reset to blank input
        setHistoryIndex(null)
        setInput('')
      }
    }

    if (e.key === 'Enter') {
      onEnter(e)
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
            onKeyDown={onKeyDown}
            placeholder="Type commands here"
          />
        </div>
      </div>
    </div>
  )
}
