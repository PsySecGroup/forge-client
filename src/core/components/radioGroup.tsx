import { For } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'
import styles from './css/radioGroup.module.css'

interface RadioGroupProps {
  options: { label: string; value: string }[]
  selectedValue: string
  onChange: (value: string) => void
}

export default function RadioGroup (props: RadioGroupProps) {
  const theme = useTheme()

  return (
    <div class={styles.radioGroup}>
      <For each={props.options}>
        {(option) => (
          <label class={styles.radioLabel}>
            <input
              type="radio"
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
