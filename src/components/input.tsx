import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { useError } from '../state/error'
import '../utils/validation'

import styles from './css/input.module.css'

type Props = {
  id: string
  type: 'text'
  value: string
  placeholder?: string
  disabled?: boolean
  label?: string
  onChange?: (value?: string) => void
  attributes?: { [key: string]: string | boolean }
  helperText?: string
  style?: Style
  classes?: Class
  inputFieldClasses?: Class
  inputHelperClasses?: Class
}

const defaultProps: Props = {
  id: '',
  type: 'text',
  value: ''
}

/**
 * 
 */
export default function TextInput(props: Props = defaultProps) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles['input'],
    {
      background: theme.palette.secondary.background, // TODO theme stuff
      color: theme.palette.secondary.text // TODO theme stuff
    }
  )

  const { classes: inputFieldClasses  } = mergeStyle({
      classes: props.inputFieldClasses as Class
    }, 
    styles['inputField']
  )

  const { classes: inputHelperClasses  } = mergeStyle({
      classes: props.inputHelperClasses as Class
    }, 
    styles['inputHelper']
  )

  // State
  const { addError } = useError() // TODO evaluate this better

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
            props.onChange && props.onChange(e.target.value)
          }
        }}

        placeholder={props.placeholder || ''}
        disabled={props.disabled || false}
        class={inputFieldClasses}
        {...props.attributes} // Spread additional input props
      />
      {props.helperText && <p style={inputHelperClasses}>{props.helperText}</p>}
    </div>
  )
}
