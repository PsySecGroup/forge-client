import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { useError } from '../state/error'

import styles from './css/input.module.css'

type Props = {
  id: string
  type: 'text'
  placeholder?: string
  disabled?: boolean
  value: string
  label?: string
  onChange?: () => void
  attributes?: { [key: string]: string | boolean }
  error?: string
  helperText?: string
  style?: Style
  classes?: Class
  inputFieldClasses?: Class
  inputErrorClasses?: Class
  inputHelperClasses?: Class
}

/**
 * 
 */
export default function TextInput(props: Props = {}) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.input,
    {
      background: theme.palette.secondary.background,
      color: theme.palette.secondary.text
    }
  )

  const { classes: inputFieldClasses  } = mergeStyle({
      classes: props.inputFieldClasses
    }, 
    styles.inputField
  )

  const { classes: inputErrorClasses  } = mergeStyle({
      classes: props.inputErrorClasses
    }, 
    styles.inputError
  )

  const { classes: inputHelperClasses  } = mergeStyle({
      classes: props.inputHelperClasses
    }, 
    styles.inputHelper
  )

  // State
  const { addError } = useError()

  // Rendering
  return (
    <div
      class={classes}
      style={style}
    >
      {props.label && <label for={props.id || 'text-input'}>{props.label}</label>}
      <input
        id={props.id || 'text-input'}
        type={props.type || 'text'}
        value={props.value}

        onInput={e => {
          // TODO remove
          if (e.target.value === '!') {
            addError('WHAT')
          } else {
            props.onChange(e.target.value)
          }
        }}

        placeholder={props.placeholder || ''}
        disabled={props.disabled || false}
        class={inputFieldClasses}
        {...props.attributes} // Spread additional input props
      />
      {props.error && <p class={inputErrorClasses}>{props.error}</p>}
      {props.helperText && <p style={inputHelperClasses}>{props.helperText}</p>}
    </div>
  )
}
