import { type ParentProps, type JSX, createContext } from 'solid-js'
import { defineActions } from '../../core/state/actions'
import { StoreProvider } from '../../core/state/provider'
import { createStore } from 'solid-js/store'

export type ConsoleCommandArgs = (string | number)[]

export type ConsoleCommand = {
  name: string
  onExecute: (args: ConsoleCommandArgs) => string | false | undefined
  permissions?: (string | number)[]
}

export type Console = {
  prompt: string
  commands: ConsoleCommand[]
  messages: string[]
}

enum CommandResult {
  NotFound = 'NOT_FOUND',
  PermissionDenied = 'PERMISSION_DENIED',
  Executed = 'EXECUTED'
}

const definition: Console = {
  prompt: '',
  commands: [],
  messages: []
}

 // Match double quotes, single quotes, or non-whitespace parts
const commandRegex = /"([^"]*)"|'([^']*)'|\S+/g

/**
 * Parses a command.
 * 
 * @example
 * Prompt:
 * someCommand "var1" var2 3 'var4'
 * 
 * Returns: {
 *   command: 'someCommand',
 *   arguments: [ 'var1', 'var2', 3, 'var4']
 * }
 */
function parseCommand(str: string) {
  const parts = str.match(commandRegex)

  if(parts === null) {
    return false
  }

  const command = parts.shift()

  if (command === undefined) {
    return false
  }

  const argumentsList = parts.map(part => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return part.slice(1, -1)
    } else if (part.startsWith("'") && part.endsWith("'")) {
      return part.slice(1, -1)
    }

    const number = Number(part)
    return isNaN(number)
      ? part
      : number
  })

  return {
    command,
    arguments: argumentsList
  }
}

export const store = createStore(definition)
const [ state, setState ] = store
type SetState = typeof setState

export const ConsoleContext = createContext(store)
export const ConsoleStore = store

export const getConsoleActions = defineActions(store, (set: SetState) => {
  const self =  {
    /**
     * 
     */
    updatePrompt: (message: string) => set('prompt', message),

    /**
     * 
     */
    sendCommand: async (message?: string, permissions: string[] = []) => {
      const prompt = message === undefined
        ? state.prompt ?? ''
        : message

      if (prompt.length === 0) {
        return false
      }
  
      const promptParts = parseCommand(prompt)
      let result = ''

      if (promptParts === false) {
        // TODO do something with errors here
        result = 'This command does not work'
      } else {
        const output = await self.runCommand(promptParts.command, promptParts.arguments, permissions)

        if (output === false) {
          result = `Command "${promptParts.command}" not found`
        } else {
          if (output !== undefined) {
            result = output
          }
          // When the command is successful, then we clear the prompt
          self.addMessage(prompt)
          self.updatePrompt('')
        }
      }

      self.addMessage(result)

      return result
    },

    /**
     * 
     */
    runCommand: async (commandName: string, args: ConsoleCommandArgs = [], permissions: string[] = []) => {
      const command = state.commands.find(command => command.name === commandName)

      if (command === undefined) {
        return CommandResult.NotFound
      }

      if (permissions.length === 0) {
        return await command.onExecute(args)
      } else {
        const hasPermission = permissions.every(permission => command.permissions?.includes(permission))

        if (hasPermission) {
          return await command.onExecute(args)
        } else {
          return CommandResult.PermissionDenied
        }
      }
    },

    /**
     * 
     */
    addMessage: (message: string) => set('messages', state.messages.length, message),

    /**
     * 
     */
    updateMessage: (index: number, message: string) => set('messages', index, message),

    /**
     * 
     */
    removeMessage: (index: number) => set(
      'messages',
      (messages) => messages.filter((_, i) => i !== index)
    ),

    /**
     * 
     */
    setCommands: (commands: ConsoleCommand[]) => set('commands', commands.map(command => ({
      permissions: [],
      ...command
    })))
  }

  return self
})

export function ConsoleProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={ConsoleContext}
      store={ConsoleStore}
    >
      {children}
    </StoreProvider>
  )
}
