import { type JSX } from 'solid-js'

export type StyleClasses = { [key: string]: boolean | (() => boolean) }

export type ComponentStyle = {
  classes?: StyleClasses
  style?: JSX.CSSProperties
}

/**
 * Gets merged classes and style information for components
 */
export function getStyling({
  className,
  classes = {},
  style = {},
  theme = {}
}: {
  className?: string | undefined
  classes?: StyleClasses | undefined
  style?: JSX.CSSProperties | undefined
  theme?: JSX.CSSProperties | undefined
}): [string, JSX.CSSProperties] {

  const mergedClasses = className === undefined
    ? []
    : [className]

  if (classes) {
    Object.entries(classes)
      .filter(([_, condition]) => {
        return typeof condition === 'function' ? condition() : condition
      })
      .forEach(([className]) => {
        // If conditional class is 'container', it should overwrite baseClass
        if (mergedClasses.indexOf(className )=== -1) {
          mergedClasses.push(className)
        }
      })
  }

  // Merge the style objects
  const mergedStyles: JSX.CSSProperties = {}

  // If style2 is provided, add its properties first (lower priority)
  Object.assign(mergedStyles, theme)

  // If style1 is provided, it overrides style2 (higher priority)
  Object.assign(mergedStyles, style)

  // Return the merged class string and style object
  return [mergedClasses.join(' '), mergedStyles]
}

/**
Usage example:

import { createMemo, useContext } from 'solid-js'
import { themeContext } from '../themes/state'
import { type ComponentStyle, getStyling } from '../themes/styles'
import css from './TestComponent.module.css'

const TestComponent = ({ classes, style }: ComponentStyle) => {
  const [ theme ] = useContext(themeContext)

  const [containerClass, containerStyle] = createMemo(() => getStyling({
    className: css['container'],
    theme: theme.primary,
    classes,
    style    
  }))()

  const [headerClass, headerStyle] = createMemo(() => getStyling({
    className: css['header'],
    theme: theme.secondary,
    classes,
    style    
  }))()

  return (
    <div class={containerClass} style={containerStyle}>
      <h1 class={headerClass} style={headerStyle}>Hello, Solid!</h1>
      <p class={css['content']}>This component has custom and module styles combined.</p>
    </div>
  );
};

export default TestComponent
*/