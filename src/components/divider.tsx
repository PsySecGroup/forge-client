import {
  Divider
} from '@suid/material'

type Props = {
  light?: boolean
}

/**
 * 
 */
export default function ListDividers(props: Props = {}) {
  // Rendering
  return (
    <Divider {...props}/>
  )
}
