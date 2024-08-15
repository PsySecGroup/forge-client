import { Box } from '@suid/material'
import { type JSX } from 'solid-js'
import { useStoreContext } from '../state'

import styles from './css/searchSpace.module.css'

export default function SearchSpace (): JSX.Element {
  const { registerGraphView, getFocusedSpaceIndex } = useStoreContext()

  return (
    <Box class={styles.graphContainer}>
      <iframe
        ref={(iframe) => { registerGraphView(getFocusedSpaceIndex(), iframe) }}
        src='/src/components/graph/index.html'
        // @ts-expect-error Scrollling does exist?
        scrolling='no'
      />
    </Box>
  )
}
