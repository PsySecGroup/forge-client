import type { Children } from '../types'
import useTheme from '@suid/material/styles/useTheme'
import { createSignal, createContext, createEffect, useContext, onCleanup, For } from 'solid-js'
import styles from '../components/css/error.module.css'

type ErrorStore = {
  addStore: undefined
}

/**
 * Create the context for the error state
 */
const ErrorContext = createContext<ErrorStore>()

type Props = {
  children?: Children
}

/**
 * ErrorProvider component to manage a queue of error messages
 */
export function ErrorProvider(props: Props) {
  // Styling
  const theme = useTheme()

  // State
  const [errors, setErrors] = createSignal<string[]>([]) // Array of errors as a FIFO queue
  
  // Helpers

  /**
   * Function to add an error to the queue
   */
  const addError = (errorMessage: string, allowMultiple = false) => {
    const errorList = errors() || []

    if (allowMultiple === true || errorList.indexOf(errorMessage) === -1) {
      setErrors((prev) => [...prev, errorMessage])
    }
  }

  /**
   * Function to remove the oldest error from the queue (FIFO)
   */
  const removeError = () => {
    setErrors((prev) => prev.slice(1)) // Remove the first element in the queue
  }

  /**
   * Clear errors after a certain timeout (e.g., 5 seconds)
   */
  const autoRemoveError = (timeout = 5000) => {
    const timeoutId = setTimeout(removeError, timeout)
    onCleanup(() => clearTimeout(timeoutId)) // Cleanup if the component unmounts
  }

  /**
   * Returns if the error queue has a specific message in it
   */
  const hasError = (errorMessage: string) => {
    return errors().indexOf(errorMessage) > -1
  }

  // Effects
  createEffect(() => {
    autoRemoveError()
  })

  // Rendering
  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, autoRemoveError, hasError }}>
      <div
        classList={{
          [styles['container'] as string]: true,
          [styles['damage'] as string]: errors().length > 0
        }}
      >
        <For each={errors()}>
          {(error) => (
            <div
              class={styles['tray']}
              style={{
                background: theme.palette.error.dark,
                color: theme.palette.primary.text // TODO figure out themes better
              }}
            >
              <p>{error}</p>
              <button onClick={removeError}>Dismiss</button>
            </div>
          )}
        </For>
      </div>
      {props.children}
    </ErrorContext.Provider>
  );
}

// Custom hook to use the ErrorContext in any component
export function useError() {
  return useContext(ErrorContext)
}
