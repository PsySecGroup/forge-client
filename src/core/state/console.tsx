import { type ParentProps, type JSX, createContext } from 'solid-js'
import { getActions } from './actions'
import { StoreProvider } from './provider'
import { createStore } from 'solid-js/store'

export type Command = {
  name: string
  onExecute: (...args: any[]) => void
  arguments?: string[]
  permissions?: (string | number)[]
}

export type Console = {
  commands: Command[]
  messages: string[]
}

const state: Console = {
  commands: [],
  messages: []
}

export const store = createStore(state)

type SetState = typeof store[1]

export const consoleContext = createContext(store)
export const consoleStore = store
export const getConsoleActions = getActions(store, (set: SetState) => ({
  addMessage: (message: string) => set('messages', store[0].messages.length, message),
  updateMessage: (index: number, message: string) => set('messages', index, message),
  removeMessage: (index: number) => set(
    'messages',
    (messages) => messages.filter((_, i) => i !== index)
  ),
  addCommands: (commands: Command[]) => set('commands', commands.map(command => ({
    arguments: [],
    permissions: [],
    ...command
  }))),
  runCommand: (commandName: string, args: string[] = [], permissions: string[] = []) => {
    const command = store[0].commands.find(command => command.name === commandName)

    if (command === undefined) {
      return false
    }

    if (permissions.length === 0) {
      return command.onExecute(args)
    } else {
      const hasPermission = permissions.every(permission => command.permissions?.includes(permission))

      if (hasPermission) {
        return command.onExecute(args)
      }
    }
  }
}))

export function ConsoleProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={consoleContext}
      store={consoleStore}
    >
      {children}
    </StoreProvider>
  )
}
