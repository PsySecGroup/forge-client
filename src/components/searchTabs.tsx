import { Box } from '@suid/material'
import { type ParentProps, type JSX } from 'solid-js'
// import { useStoreContext } from '../state'

// import styles from './css/template.module.css'

interface Props extends ParentProps {}

export default function SearchTabs (props: Props): JSX.Element {
  // const {  } = useStoreContext()

  return (
    <Box style={{
      'border-bottom': '1px solid black',
      'line-height': '2em'
    }}>
      Inquire
    </Box>
  )
}
