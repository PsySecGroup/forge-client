import { Box, Grid } from '@suid/material'
import HomeIcon from '@suid/icons-material/Home'
import RefreshIcon from '@suid/icons-material/Refresh'
import SearchIcon from '@suid/icons-material/Search'
import { type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import logo from '../assets/logo.svg'
import BottomNavigation from '../core/components/bottomNavigation'
import AppBar from '../core/components/AppBar'
import CandlestartChart from '../core/components/candlestickChart'
import Tools from './tools'
import Viewport from '../core/components/viewport'
import useTheme from '@suid/material/styles/useTheme'
import { candlestickSimulator } from '../core/utils/candlestickSimulator' // TODO move this
import styles from './css/index.module.css'

type Props = {}

export default function MainPage (props: Props = {}): JSX.Element {
  const { values, setValues } = useStoreContext()
  const theme = useTheme()
  const prices = candlestickSimulator(50, 6, 25)

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
      footer={(<BottomNavigation
        highlight
        option={values.nav}
        actions={{
          home: {
            label: 'Home',
            onClick: (nav) => setValues({
              nav
            })
          },
          refresh: {
            label: 'Refresh',
            onClick: (nav) => setValues({
              nav
            })
          },
          search: {
            label: 'Search',
            onClick: (nav) => setValues({
              nav
            })
          }
        }}
      />)}
    >
      <Grid container spacing={0} style={{
          background: theme.palette.primary.background,
          color: theme.palette.primary.text
        }}>
        <Grid item xs={6} md={8} lg={9}>
          <div class={styles.section}>
            <CandlestartChart
              backgroundColor={'lightgray'}
              xAxisLabel={'Time (50 minute blocks'}
              yAxisLabel={'Price (USD)'}
              xData={prices.line}
              yData={prices.bars}
            />
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
