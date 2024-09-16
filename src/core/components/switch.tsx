import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/switch.module.css'

type DatePickerProps = {
  checked: boolean
  onChange?: () => void
  style?: Style
  classes?: Class
  sliderClasses?: Class
}

export default function Switch (props: Props) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.switch
  )

  const { classes: sliderClasses  } = mergeStyle({
      classes: props.sliderClasses
    }, 
    styles.slider
  )

  // Rendering
  return (
    <label
      class={classes}
      style={style}
    >
      <input type="checkbox"
        checked={props.checked}
        onChange={e => props.onChange(e.target.checked)}
      />
      <span class={sliderClasses}></span>
    </label>
  )
}
