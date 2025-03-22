import { createMemo, useContext } from 'solid-js'
import { ThemeContext } from '../../themes/state'
import { type ComponentStyle, getStyling } from '../../themes/styles'
import css from './themedBox.module.css'

export const ThemedBox = ({ classes, style }: ComponentStyle) => {
  const [ theme ] = useContext(ThemeContext)

  const containerMemo = createMemo(() => getStyling({
    classes,
    className: css['container'],
    style: style?.['container'],
    theme: theme.primary
  }))

  const headerMemo = createMemo(() => getStyling({
    classes,
    className: css['header'],
    style: style?.['header'],
    theme: theme.secondary
  }))

  return (
    <div class={containerMemo().classes} style={containerMemo().style}>
      <h1 class={headerMemo().classes} style={headerMemo().style}>Hello, Solid!</h1>
    </div>
  )
}
