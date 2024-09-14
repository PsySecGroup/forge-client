import { Box, Grid } from '@suid/material'
import HomeIcon from "@suid/icons-material/Home"
import RefreshIcon from "@suid/icons-material/Refresh"
import SearchIcon from "@suid/icons-material/Search"
import { type ParentProps, type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import logo from '../assets/logo.svg'
import BottomNavigation from '../core/components/bottomNavigation'
import AppBar from '../core/components/AppBar'
import CandlestartChart from '../core/components/candlestickChart'
import Tools from './tools'
import Viewport from '../core/components/viewport'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/index.module.css'

interface Props extends ParentProps {}

export default function MainPage (props: Props): JSX.Element {
  const { values } = useStoreContext()
  const theme = useTheme()

  return (
    <Viewport
      header={<div
        class={styles.header}
        style={{
          background: theme.palette.secondary.background,
          color: theme.palette.secondary.text
        }}>
          Application Bar
        </div>}
      footer={<BottomNavigation
        highlight
        option="refresh"
        actions={{
          home: {
            label: "Home",
            onClick: console.log
          },
          refresh: {
            label: "Refresh",
            onClick: console.log
          },
          search: {
            label: "Search",
            onClick: console.log
          }
        }}
      />}
    >
      <Grid container spacing={0} style={{
          background: theme.palette.primary.background,
          color: theme.palette.primary.text
        }}>
        <Grid item xs={6} md={8} lg={9}>
          <div class={styles.section}>
            <CandlestartChart />
          </div>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <div class={styles.section}>
            <Tools />
          </div>
        </Grid>
      </Grid>
    </Viewport>
  )
}
