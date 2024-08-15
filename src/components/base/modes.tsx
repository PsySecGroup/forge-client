import { type Space } from '../../types/space'
import { For, type JSX } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from '../../state'

import styles from '../css/modes.module.css'

export interface Mode<valueType = string> {
  label: string
  value: valueType
  property: keyof Space
}

interface Props {
  name: string
  styles?: CSSModuleClasses
  options?: Mode[]
}

export default function Modes (props: Props): JSX.Element {
  const { updateFocusedSpace, getFocusedSpace } = useStoreContext()

  const changeMode = (mode: Mode): void => {
    updateFocusedSpace({
      [mode.property]: mode.value
    })
  }

  return (
    <Box>
      <h4 class={props.styles?.label ?? styles.label}>{props.name}</h4>
      <div class={props.styles?.buttonGroup ?? styles.buttonGroup}>
        <For each={props?.options ?? []}>{option => (
          <div
            class={`${getFocusedSpace()[option.property] === option.value
              ? styles.buttonActive
              : ''
            } ${styles.button}`}
            onClick={() => { changeMode(option) }}
          >
            {option.label}
          </div>
        )}</For>
      </div>
    </Box>
  )
}
