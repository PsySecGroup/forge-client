import type { JSX, ParentProps } from 'solid-js'
import { createMemo } from 'solid-js'
import ThemeProvider from '@suid/system/ThemeProvider'
import createTheme from '@suid/system/createTheme'
import { mainLight } from './light'
import { mainDark } from './dark'
import { useStoreContext } from '../core'

type Props = {}

export type Themes = keyof typeof themes

const themes = {
  mainLight,
  mainDark
}

let firstTime = true

export default function ThemesProvider (props: ParentProps<Props>): JSX.Element {
  const { ui } = useStoreContext()

  const theme = createMemo(() => {
    // TODO SUID has very stupid opinions regarding
    // destructing that prevent Solid from tracking,
    // so we timeout a page reload when the theme changes
    if (firstTime) {
      firstTime = false
    } else {
      setTimeout(
        () => { location.reload() },
        100
      )
    }
    return createTheme(themes[ui.theme])
  }, { equals: false })

  return (
    <ThemeProvider theme={theme()}>
      {props.children}
    </ThemeProvider>
  )
}
