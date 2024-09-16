import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/checkbox.module.css'

type DatePickerProps = {
  checked: boolean
  onChange?: () => void
  style?: Style
  classes?: Class
}

export default function Checkbox (props: Props) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props
  )

  return (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={e => props.onChange(e.target.checked)}
      class={classes}
      style={style}
    />
  )
}
