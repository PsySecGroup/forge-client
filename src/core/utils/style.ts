import type { Style, Class } from '../types/index'

/**
 *
 */
export function mergeStyle(
  props: { classes?: Class; style?: Style } = {},
  defaultClass: Class = '',
  defaultStyle: Style = {}
) {
  // Function to convert classList (string, array, or object) to string
  const processClassList = (classInput: Class) => {
    if (typeof classInput === 'string') {
      return classInput
    } else if (Array.isArray(classInput)) {
      return classInput.join(' ')
    } else if (typeof classInput === 'object') {
      return Object.entries(classInput)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([className]) => className)
        .join(' ')
    }
    return ''
  }

  // Merge defaultClass and props.classes
  const mergedClass = `${processClassList(defaultClass)} ${processClassList(props.classes)}`.trim()

  return {
    style: { ...defaultStyle, ...props.style },
    classes: mergedClass
  }
}