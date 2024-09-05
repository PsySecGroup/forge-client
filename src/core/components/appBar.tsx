import { type ParentProps, type JSX } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'
import styles from './css/appBar.module.css'

interface Props extends ParentProps {
  children: JSX.Element[]
}

export default function AppBar ({ children }): JSX.Element {
  const theme = useTheme()

  return (
    <div 
      class={styles.appBar}
      style={{
        background: theme.palette.primary.dark, 
        color: theme.palette.primary.contrastText
      }}
    >
      {children}
    </div>
  )
}
