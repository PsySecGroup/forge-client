import './themes/reset.css'

import { type ParentProps, type JSX } from 'solid-js'
import { ConsoleCommand, ConsoleProvider, getConsoleActions } from './state/console'
import { NavigationProvider } from './state/navigation'
import { NotificationsProvider } from './state/notifications'
import { ThemeProvider } from './themes/index'
import Console from '../components/Console'

type Props = ParentProps<{
  consoleCommands?: ConsoleCommand[]
}>

export const ForgeApp = ({ 
    children,
    consoleCommands = []
}: Props
): JSX.Element => {
  const { setCommands } = getConsoleActions()

  if (consoleCommands.length > 0) {
    setCommands(consoleCommands)
  }

  return (
    <ConsoleProvider>
      <NavigationProvider>
        <NotificationsProvider>
          <ThemeProvider>
            {children}
            <Console />
          </ThemeProvider>
        </NotificationsProvider>
      </NavigationProvider>
    </ConsoleProvider>
  )
}
