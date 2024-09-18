import { Box } from '@suid/material'
import { type ParentProps, type JSX } from 'solid-js'
// import { useStoreContext } from '../core'

import styles from './css/example.module.css'

type Props = {}

export default function ExampleComponent (props: ParentProps<Props>): JSX.Element {
  // (-->) If you need access to central state helpers, do it here
  // const {  } = useStoreContext()

  return (
    <Box>

    </Box>
  )
}
