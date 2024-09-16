import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { createSignal } from "solid-js"

import styles from './css/select.module.css'

interface Props extends ParentProps {
  id: string
  value: string
  onChange: () => void
  label?: string
  disabled?: boolean
  placeholder?: string
  attributes?: { [key: string]: string | boolean }
  error?: string
  helperText?: string
  options: string[] | {
    label: string
    value: string
  }[]
  style?: Style
  classes?: Class
  selectClasses?: Class
  errorClass?: Class
  helperClass?: Class
}


export default function Select(props: Props) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.container
  )

  const { classes: selectClasses  } = mergeStyle({
      classes: props.selectClasses
    }, 
    styles.select
  )

  const { classes: errorClass } = mergeStyle({
      classes: props.errorClass
    }, 
    styles.error
  )

  const { classes: helperClass } = mergeStyle({
      classes: props.helperClass
    }, 
    styles.helper
  )

  // State
  return (
    <div
      class={classes}
      style={style}
    >
      {props.label && <label for={props.id || "select-input"}>{props.label}</label>}
      <select
        id={props.id || "select-input"}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        disabled={props.disabled || false}
        class={selectClasses}
        {...props.selectProps} // Spread additional select props
      >
        {props.placeholder && (
          <option value="" disabled hidden>
            {props.placeholder}
          </option>
        )}
        {props.options.map((option) =>
          typeof option === "string" ? (
            <option
              value={option}
              key={option}
              selected={option === props.value}
            >
              {option}
            </option>
          ) : (
            <option
              value={option.value}
              key={option.value}
              selected={option === props.value}
            >
              {option.label}
            </option>
          )
        )}
      </select>
      {props.error && <p class={errorClass}>{props.error}</p>}
      {props.helperText && <p class={helperClass}>{props.helperText}</p>}
    </div>
  );
}
