import { For, type JSX } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from '../state'

import styles from './css/persistingNodes.module.css'
import { pushUnique, splice } from '../utils/lists'

export default function PersistingNodes (): JSX.Element {
  const { getFocusedSpace, setSpaces, getFocusedSpaceIndex } = useStoreContext()

  /**
   *
   */
  const isChecked = (nodeId: string): boolean | undefined => {
    const space = getFocusedSpace()
    const persisting = space.persisting[space.clustering]
    const isChecked = persisting.findIndex(element => element === nodeId) > -1

    return isChecked
  }

  /**
   *
   */
  const onCheck = (nodeId: string) => {
    return () => {
      // TODO e.preventDefault should be implemented
      // but the checked attribute isn't working
      // e.preventDefault()
      const space = getFocusedSpace()
      const spaceIndex = getFocusedSpaceIndex()
      const list = space.persisting[space.clustering]
      const position = list.findIndex(element => element === nodeId)

      const newPersisting = position > -1
        ? splice(list, position)
        : pushUnique(list, nodeId)

      setSpaces(spaceIndex, 'persisting', space.clustering, newPersisting)
    }
  }

  return (
    <Box class={styles.persistingComponent}>
      <h4 class={styles.label}>Persisting Nodes</h4>
      <div class={styles.persistingContainer}>
        <For each={getFocusedSpace().persisting[getFocusedSpace().clustering]}>
          {(node) => (
            <div
              class={styles.persistingOption}
              onClick={onCheck(node)}
            >
              <span class={styles.persistingOptionCheck}>
                <input
                  type="checkbox"
                  value={node}
                  checked={isChecked(node)}
                />
              </span>
              <span class={styles.persistingOptionValue}>
                {node}
              </span>
            </div>
          )}
        </For>
      </div>
    </Box>
  )
}
