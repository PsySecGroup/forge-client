import { createSignal } from "solid-js"
import styles from './css/checkbox.module.css'

type DatePickerProps = {
  checked: boolean
  onChange?: () => void
};

export default function Checkbox (props: Props) {
  return (
    <input type="checkbox"
      checked={props.checked}
      onChange={e => props.onChange(e.target.checked)}
    />
  )
}
