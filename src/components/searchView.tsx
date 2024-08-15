import { type Space } from '../types/space'
import { For, type JSX } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from '../state'

import styles from './css/searchView.module.css'

interface Option {
  label: string
  value: Space['view']
  property: keyof Space
}

const options: Option[] = [
  {
    label: 'Graph',
    value: 'graph',
    property: 'view'
  },
  {
    label: 'Table',
    value: 'table',
    property: 'view'
  },
  {
    label: 'Sources',
    value: 'sources',
    property: 'view'
  }
]

export default function SearchView (props: { options?: Option[] } = {}): JSX.Element {
  const { updateFocusedSpace, getFocusedSpace } = useStoreContext()

  const changeView = (option: Option): void => {
    updateFocusedSpace({
      [option.property]: option.value
    })
  }

  return (
    <Box class={styles.buttonGroup}>
      <For each={props?.options ?? options}>{option => (
        <div
          class={`${getFocusedSpace()[option.property] === option.value
            ? styles.buttonActive
            : ''
          } ${styles.button}`}
          onClick={() => { changeView(option) }}
        >
          {option.label}
        </div>
      )}</For>
    </Box>
  )
}
