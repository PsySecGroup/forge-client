import useTheme from '@suid/material/styles/useTheme'
import { createSignal, createContext, useContext, onCleanup, For } from 'solid-js'
import styles from '../components/css/error.module.css'

type ErrorStore = {}

/**
 * Create the context for the error state
 */
const ErrorContext = createContext<ErrorStore>()


/**
 * ErrorProvider component to manage a queue of error messages
 */
export function ErrorProvider(props) {
  // Styling
  const theme = useTheme()

  // State
  const [errors, setErrors] = createSignal([]) // Array of errors as a FIFO queue
  
  /**
   * Function to add an error to the queue
   */
  const addError = (errorMessage, allowMultiple = false) => {
    if (allowMultiple === true || errors().indexOf(errorMessage) === -1) {
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
  const hasError = (errorMessage) => {
    return errors().indexOf(errorMessage) > -1
  }

  // Rendering
  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, autoRemoveError, hasError }}>
      <div
        classList={{
          [styles.container]: true,
          [styles.damage]: errors().length > 0,
        }}
      >
        <For each={errors()}>
          {(error, index) => (
            <div
              class={styles.tray}
              style={{
                background: theme.palette.error.dark,
                color: theme.palette.primary.text
              }}
            >
              <p>{error}</p>
              <button onClick={removeError}>Dismiss</button>
              {autoRemoveError()}
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
