import type { Style, Class } from '../types/index'

interface Props {
  defaultStyle?: Style
  defaultClass?: Class
  style?: Style
  class?: Class
  [key: string]: any
}

/**
 *
 */
export function mergeStyle (
  props: Props = {},
  defaultClass: Class = '',
  defaultStyle: Style = {}
) {
  // Function to convert classList (object) to string
  const processClassList = (classInput: Class) => {
    if (typeof classInput === 'string') {
      return classInput
    } else if (typeof classInput === 'object') {
      return Object.entries(classInput)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([className]) => className)
        .join(' ')
    }
    return ''
  }

  // Merge defaultClass and props.class
  const mergedClass = `${processClassList(defaultClass)} ${processClassList(props.class)}`.trim()

  return {
    style: { ...defaultStyle, ...props.style },
    classes: mergedClass
  }
}
