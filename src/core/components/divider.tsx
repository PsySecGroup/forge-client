import {
  Divider
} from '@suid/material'

interface Props extends ParentProps {
  light?: boolean
}

export default function ListDividers(props: Props = {}) {
  return (
    <Divider {...props}/>
  )
}
