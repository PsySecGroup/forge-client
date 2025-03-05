import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
// import useTheme from '@suid/material/styles/useTheme'

// import styles from './css/checkbox.module.css'

type Props = {
  checked: boolean
  onChange: (checked?: boolean) => void
  style?: Style
  classes?: Class
}

const defaultProps: Props = {
  checked: false,
  onChange: () => undefined
}

/**
 * 
 */
export default function Checkbox (props: Props = defaultProps) {
  // Styling
  // const theme = useTheme()

  const { style, classes } = mergeStyle(
    props
  )

  // Rendering
  return (
    <input
      type='checkbox'
      checked={props.checked}
      onChange={e => props.onChange(e.target.checked)}
      class={classes}
      style={style}
    />
  )
}
