import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/buttonGroup.module.css'

type Props = {
  buttons: string[] | JSX.Element[]
  activeIndex: number
  onButtonClick?: (index: number) => void
  style?: Style
  classes?: Class
}

/**
 * 
 */
export default function ButtonGroup (props: Props = {}) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.buttonGroup
  )

  // State

  /**
   * 
   */
  const handleButtonClick = (index: number) => {
    if (props.onButtonClick) {
      props.onButtonClick(index)
    }
  }

  // Rendering
  return (
    <div
      class={classes}
      style={style}
    >
      {props.buttons.map((button, index) => (
        <button
          class={`${styles.button} ${index === props.activeIndex ? styles.active : ''}`}
          onClick={() => handleButtonClick(index)}
        >
          {button}
        </button>
      ))}
    </div>
  )
}
