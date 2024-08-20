import { Box } from '@suid/material'
import { type ParentProps, type JSX } from 'solid-js'
// import { useStoreContext } from '../state'

import styles from './css/example.module.css'

interface Props extends ParentProps {}

export default function ExampleComponent (props: Props): JSX.Element {
  // (-->) If you need access to central state helpers, do it here
  // const {  } = useStoreContext()

  return (
    <Box>

    </Box>
  )
}
