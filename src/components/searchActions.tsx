import { For, Show, type ValidComponent, createSignal, type JSX } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from '../state'

import styles from './css/clusterModes.module.css'
import { Dynamic, Portal } from 'solid-js/web'
import Modal from './base/modal'

interface Action {
  label: string
  popup: ValidComponent | undefined
}

const actions: Action[] = [
  {
    label: 'Enrich',
    // TODO build popup
    popup: () => <>Sending this search space to a GPT is coming soon!</>
  },
  {
    label: 'Merge',
    // TODO build popup
    popup: () => <>Merging this search space with other search spaces is coming soon! </>
  },
  {
    label: 'Export',
    // TODO build popup
    popup: () => <>Exporting this search space is coming soon!</>
  },
  {
    label: 'Delete',
    // TODO build popup
    popup: () => <>Deleting this search space is coming soon!</>
  }
]

export default function SearchActions (props: { actions?: Action[] } = {}): JSX.Element {
  const { getFocusedSpace } = useStoreContext()
  const [modal, setModal] = createSignal<string>('')

  const close = (): void => {
    setModal('')
  }

  return (
    <Box>
      <h4 class={styles.label}>Actions</h4>
      <div class={styles.buttonGroup}>
        <For each={props?.actions ?? actions}>{action => (
          <div class={`${styles.button} ${modal() === action.label
            ? styles.buttonActive
            : ''
          }`}>
            <div
              onClick={() => { setModal(action.label) }}
            >
              {action.label}
            </div>
            <Show when={modal() === action.label}>
              <Portal>
                <Modal close={close}>
                  <Dynamic
                    component={action.popup}
                    space={getFocusedSpace()}
                  />
                </Modal>
              </Portal>
            </Show>
          </div>
        )}</For>
      </div>
    </Box>
  )
}
