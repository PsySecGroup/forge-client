import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
// import useTheme from '@suid/material/styles/useTheme'

import styles from './css/switch.module.css'

type Props = {
  checked: boolean
  onChange?: (value?: boolean) => void
  style?: Style
  classes?: Class
  sliderClasses?: Class
}

const defaultProps: Props = {
  checked: false
}

/**
 * 
 */
export default function Switch (props: Props = defaultProps) {
  // Styling
  // const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles['switch']
  )

  const { classes: sliderClasses  } = mergeStyle({
      classes: props.sliderClasses as Class
    }, 
    styles['slider']
  )

  // Rendering
  return (
    <label
      class={classes}
      style={style}
    >
      <input type='checkbox'
        checked={props.checked}
        onChange={e => props.onChange && props.onChange(e.target.checked)}
      />
      <span class={sliderClasses}></span>
    </label>
  )
}
