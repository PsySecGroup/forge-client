import { type ConsoleCommandArgs, getNavigationActions, getNotificationActions } from "./core"

type ConsoleCommands = {
  name: string
  onExecute: (args: ConsoleCommandArgs) => string | false
}[]

export function getConsoleCommands () {
  const { goto } = getNavigationActions()
  const { addNotification } = getNotificationActions()
  
  const commands: ConsoleCommands = [
    /**
     * 
     */
    {
      name: 'goto',
      onExecute: (args: ConsoleCommandArgs) => {
        const [ location ] = args as [string]

        if(location === '' || location === undefined) {
          return 'Unspecified location'
        }

        goto(location)

        return 'Going to ' + location
      }
    },

    /**
     * 
     */    
    {
      name: 'notify',
      onExecute: (args: ConsoleCommandArgs) => {
        const [ type, message ] = args as [string, string]

        if(!type || !message) {
          return false
        }

        addNotification({
          id: Date.now(),
          text: message,
          type
        })

        return 'Added notification'
      }
    },

    /**
     * 
     */
    {
      name: 'help',
      onExecute: () => {
        const result = commands.map(command => command.name).join(', ')
        return `Commands: ${result}`
      }
    }
  ]

  return commands
}
