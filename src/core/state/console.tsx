import { type ParentProps, type JSX, createContext, batch } from 'solid-js'
import { getActions } from './actions'
import { StoreProvider } from './provider'
import { createStore } from 'solid-js/store'

export type Command = {
  name: string
  onExecute: (...args: any[]) => string
  arguments?: (string | number)[]
  permissions?: (string | number)[]
}

export type Console = {
  prompt: string
  commands: Command[]
  messages: string[]
}

const state: Console = {
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

export const store = createStore(state)

type SetState = typeof store[1]

export const consoleContext = createContext(store)
export const consoleStore = store
export const getConsoleActions = getActions(store, (set: SetState) => {
  const self =  {
    /**
     * 
     */
    updatePrompt: (message: string) => set('prompt', message),

    /**
     * 
     */
    sendCommand: (message?: string, permissions: string[] = []) => {
      const prompt = message === undefined
        ? store[0].prompt ?? ''
        : message
  
      if (prompt.length === 0) {
        return false
      }
  
      const promptParts = parseCommand(prompt)
      let result = ''
  
      batch(async () => {
        self.addMessage(prompt)
        
        if (promptParts === false) {
          // TODO do something with errors here
          result = 'This command does not work'
        } else {
          const output = await self.runCommand(promptParts.command, promptParts.arguments, permissions)

          if (output === false) {
            result = `Command "${promptParts.command}" not found`
          } else {
            result = output
            // When the command is successful, then we clear the prompt
            self.updatePrompt('')
          }
        }

        set('messages', store[0].messages.length, result)
      })

      return result
    },

    /**
     * 
     */
    addMessage: (message: string) => set('messages', store[0].messages.length, message),

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
    addCommands: (commands: Command[]) => set('commands', commands.map(command => ({
      arguments: [],
      permissions: [],
      ...command
    }))),

    /**
     * 
     */
    runCommand: async (commandName: string, args: (string | number)[] = [], permissions: string[] = []) => {
      const command = store[0].commands.find(command => command.name === commandName)
  
      if (command === undefined) {
        return false
      }
  
      if (permissions.length === 0) {
        return await command.onExecute(args)
      } else {
        const hasPermission = permissions.every(permission => command.permissions?.includes(permission))
  
        if (hasPermission) {
          return await command.onExecute(args)
        } else {
          return false
        }
      }
    }
  }

  return self
})

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
