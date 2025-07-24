import './app.module.css'
import { getConsoleCommands } from './console'
import { ForgeApp } from './core'
import { ForgeLayout } from './layouts/forge'
import { LeftSide } from './pages/main/actions'
import { MainPage } from './pages/main/mainPage'
import { DesktopTrayButtons, MobileTrayButtons } from './pages/router'

export function App () {
  return (
    <ForgeApp
      consoleCommands={getConsoleCommands()}
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
