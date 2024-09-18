import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import { For } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/radioGroup.module.css'

type Props = {
  options: { label: string; value: string }[]
  selectedValue: string
  onChange: (value: string) => void
  style?: Style
  classes?: Class
  radioLabelClasses?: Class
}

/**
 * 
 */
export default function RadioGroup (props: Props = {}) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.radioGroup,
    {
      background: theme.palette.primary.background,
      color: theme.palette.primary.text
    }
  )

  const { classes: radioLabelClasses  } = mergeStyle({
      classes: props.radioLabelClasses
    }, 
    styles.radioLabel
  )

  // Rendering
  return (
    <div
      class={classes}
      style={styles}
    >
      <For each={props.options}>
        {(option) => (
          <label class={radioLabelClasses}>
            <input
              type='radio'
              value={option.value}
              checked={props.selectedValue === option.value}
              onChange={() => props.onChange(option.value)}
            />
            {option.label}
          </label>
        )}
      </For>
    </div>
  )
}
