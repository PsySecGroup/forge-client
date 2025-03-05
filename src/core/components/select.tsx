import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import { For } from 'solid-js'
// import useTheme from '@suid/material/styles/useTheme'

import styles from './css/select.module.css'

type Props = {
  id: string
  value: string
  onChange: (value: string) => void
  options: string[] | {
    label: string
    value: string
  }[]
  label?: string
  disabled?: boolean
  placeholder?: string
  attributes?: { [key: string]: string | boolean }
  error?: string
  helperText?: string
  style?: Style
  classes?: Class
  selectClasses?: Class
  errorClass?: Class
  helperClass?: Class
}

const defaultProps: Props = {
  id: '',
  value: '',
  onChange: () => undefined,
  options: []
}

/**
 * 
 */
export default function Select(props: Props = defaultProps) {
  // Styling
  // const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles['container']
  )

  const { classes: selectClasses  } = mergeStyle({
      classes: props.selectClasses as Class
    }, 
    styles['select']
  )

  const { classes: errorClass } = mergeStyle({
      classes: props.errorClass as Class
    }, 
    styles['error']
  )

  const { classes: helperClass } = mergeStyle({
      classes: props.helperClass as Class
    }, 
    styles['helper']
  )

  // State
  return (
    <div
      class={classes}
      style={style}
    >
      {props.label && <label for={props.id || 'select-input'}>{props.label}</label>}
      <select
        id={props.id || 'select-input'}
        value={props.value}
        onChange={e => props.onChange && props.onChange(e.target.value)}
        disabled={props.disabled || false}
        class={selectClasses}
      >
        {props.placeholder && (
          <option value='' disabled hidden>
            {props.placeholder}
          </option>
        )}
        <For each={props.options}>
          {(option) =>
            typeof option === 'string' ? (
              <option
                value={option}
                selected={option === props.value}
              >
                {option}
              </option>
            ) : (
              <option
                value={option.value}
                selected={option.value === props.value}
              >
                {option.label}
              </option>
            )
          }
        </For>
      </select>
      {props.error && <p class={errorClass}>{props.error}</p>}
      {props.helperText && <p class={helperClass}>{props.helperText}</p>}
    </div>
  )
}
