import { Box, Grid } from '@suid/material'
import { type ParentProps, type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import styles from './css/tools.module.css'
import Button from '../core/components/button'

interface Props extends ParentProps {}

export default function ToolsPage (props: Props): JSX.Element {
  const { values } = useStoreContext()

  return (
    <div>
      Tools<br />
    <Button>yo</Button>
    </div>
  )
}
