import { type JSX } from 'solid-js'

export type StyleClasses = string | boolean | (() => boolean | string)

export type ComponentStyle = {
  classes?: { [key: string]: StyleClasses }
  style?: { [key: string]: JSX.CSSProperties }
}

/**
 * 
 */
function getClass(identifier: string) {
  return identifier[0] === '_'
    ? identifier.substring(0, identifier.lastIndexOf('_'))
    : identifier
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
  classes?: { [key: string]: StyleClasses } | undefined
  style?: JSX.CSSProperties | undefined
  theme?: JSX.CSSProperties | undefined
}): [string, JSX.CSSProperties] {

  const mergedClasses = className === undefined
    ? {}
    : { [getClass(className)]: className }

  if (classes) {
    Object.entries(classes)
      .map(([_, condition]) => {
        return typeof condition === 'function' ? condition() : condition
      })
      .filter(value => value !== false)
      .forEach((className, i, classes) => {
        // If conditional class is 'container', it should overwrite baseClass
        const targetClass = className === true
          ? classes[i] as string
          : className

        const trimmeClassName = getClass(targetClass)

        if(mergedClasses[trimmeClassName] !== undefined) {
          mergedClasses[trimmeClassName] = targetClass
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
  return [Object.values(mergedClasses).join(' '), mergedStyles]
}
