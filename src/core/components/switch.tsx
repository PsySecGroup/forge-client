import { createSignal } from "solid-js"
import styles from './css/switch.module.css'

type DatePickerProps = {
  checked: boolean
  onChange?: () => void
};

export default function Switch (props: Props) {

  return (
    <label class={styles.switch}>
      <input type="checkbox"
        checked={props.checked}
        onChange={e => props.onChange(e.target.checked)}
      />
      <span class={styles.slider}></span>
    </label>
  )
}
