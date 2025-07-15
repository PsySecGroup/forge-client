import './app.module.css'
import {
  type ConsoleCommandArgs,
  ForgeApp,
  getNavigationActions,
  getNotificationActions,
} from './core'
import { ForgeLayout } from './layouts/forge'
import { LeftSide } from './pages/main/actions'
import { MainPage } from './pages/main/mainPage'
import { DesktopTrayButtons, MobileTrayButtons } from './pages/router'

export function App () {
  const { goto } = getNavigationActions()
  const { addNotification } = getNotificationActions()
  
  const consoleCommands = [{
    name: 'goto',
    onExecute: (args: ConsoleCommandArgs) => {
      const [ location ] = args as [string]

      if(location === '') {
        return false
      }

      goto(location)

      return 'Going to ' + location
    }
  }, {
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
  }]

  return (
    <ForgeApp
      consoleCommands={consoleCommands}
    >
      <ForgeLayout
        appBar={<></>}
        left={<LeftSide />}
        main={<MainPage />}
        desktopActions={<DesktopTrayButtons />}
        mobileActions={MobileTrayButtons}
      />
    </ForgeApp>
  )
}
