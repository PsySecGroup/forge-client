import './app.module.css'
import {
  type ConsoleCommandArgs,
  ForgeApp,
  getNavigationActions,
} from './core'
import { ForgeLayout } from './layouts/forge'
import { LeftSide } from './pages/main/actions'
import { MainPage } from './pages/main/mainPage'
import { DesktopTrayButtons, MobileTrayButtons } from './pages/router'

export function App () {
  const { goto } = getNavigationActions()
  
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
