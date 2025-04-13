import './app.module.css'
import { NavButton } from './components/NavButton'

import {
  type ConsoleCommandArgs,
  ForgeApp,
  getNavigationActions,
} from './core'
import { ForgeLayout } from './layouts/forge'

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
        left={<>
          <NavButton location='test'>
            Test
          </NavButton>
          <NavButton location='next'>
            Next
          </NavButton>
        </>}
        main={<></>}
        right={<></>}
      />
    </ForgeApp>
  )
}
