import { Box, Grid } from '@suid/material'
import { type ParentProps, type JSX } from 'solid-js'
// import { useStoreContext } from '../state'

import styles from './search.module.css'
import SearchControls from '../components/searchControls'
import SearchSpace from '../components/searchSpace'
import SearchTabs from '../components/searchTabs'

interface Props extends ParentProps {}

export default function SearchPage (props: Props): JSX.Element {
  // const { spaces, setSpaces } = useStoreContext()

  return (
    <Box>
      <SearchTabs />
      <Box
        class={styles.pageContainer}
        sx={{
          backgroundColor: 'background.paper'
        }}
      >
        <Grid
          container
          spacing={0}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={8} class={styles.pageSection} style={{
            margin: 0,
            padding: 0
          }}>
            <SearchSpace />
          </Grid>
          <Grid item xs={4} class={styles.pageSection}>
            <SearchControls />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
