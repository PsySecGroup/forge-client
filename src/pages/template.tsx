import { Box } from '@suid/material'
import { type ParentProps, type JSX } from 'solid-js'
// import { useStoreContext } from '../state'

import styles from './search.module.css'

interface Props extends ParentProps {}

export default function TemplatePage (props: Props): JSX.Element {
  // const {  } = useStoreContext()

  return (
    <Box class={styles.App}>
      <Box
        sx={{
          bgcolor: 'background.paper'
        }}
        class={styles.header}
      >
      </Box>
    </Box>
  )
}
