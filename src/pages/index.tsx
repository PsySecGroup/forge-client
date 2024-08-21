import { Box, Grid } from '@suid/material'
import HomeIcon from "@suid/icons-material/Home"
import RefreshIcon from "@suid/icons-material/Refresh"
import SearchIcon from "@suid/icons-material/Search"
import { type ParentProps, type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import logo from '../assets/logo.svg'
import styles from './css/index.module.css'
import BottomNavigation from '../core/components/bottomNavigation'
import AppBar from '../core/components/AppBar'

interface Props extends ParentProps {}

export default function MainPage (props: Props): JSX.Element {
  const { values } = useStoreContext()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <div>Application Bar</div>
      </AppBar>

      <Grid container spacing={0}>
        <Grid item xs={6} md={8} lg={9}>
          <div class={styles.App}>
            <header class={styles.header}>
              <img src={logo} class={styles.logo} alt="logo" />
              <p>
                Edit <code>src/pages/index.tsx</code> and save to reload.
              </p>
              <a
                class={styles.link}
                href="https://github.com/solidjs/solid"
                target="_blank"
                rel="noopener noreferrer"
              >
                Welcome to the Forge Client<br />
                Admin mode? ({values.closeEverything ? 'yes' : 'no'})
              </a>
            </header>
          </div>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <div class={styles.cell}>xs=6 md=4</div>
        </Grid>
      </Grid>

      <BottomNavigation highlight actions={{
        home: {
          label: "Home",
          onClick: (key) => key
        },
        refresh: {
          label: "Refresh",
          onClick: (key) => key
        },
        search: {
          label: "Search",
          onClick: (key) => key
        }
      }} />
    </Box>
    /*
    
    */
  )
}
