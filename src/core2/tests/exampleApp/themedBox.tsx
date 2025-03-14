import { createMemo, useContext } from 'solid-js'
import { themeContext } from '../../themes/state'
import { type ComponentStyle, getStyling } from '../../themes/styles'
import css from './themedBox.module.css'

export const ThemedBox = ({ classes, style }: ComponentStyle) => {
  const [ theme ] = useContext(themeContext)

  const [containerClass, containerStyle] = createMemo(() => getStyling({
    classes,
    className: css['container'],
    style: style?.['container'],
    theme: theme.primary
  }))()

  const [headerClass, headerStyle] = createMemo(() => getStyling({
    classes,
    className: css['header'],
    style: style?.['header'],
    theme: theme.secondary
  }))()

  return (
    <div class={containerClass} style={containerStyle}>
      <h1 class={headerClass} style={headerStyle}>Hello, Solid!</h1>
    </div>
  )
}
