import { Box } from '@suid/material'
import { type JSX } from 'solid-js'
import SourceDropdown from './sourceDropdown'
import SearchQuery from './searchQuery'
import SearchView from './searchView'
import LinkageSlider from './linkageSlider'
import ClusterModes from './clusterModes'
import PersistingNodes from './persistingNodes'
import SearchActions from './searchActions'
import CoverageSlider from './coverageSlider'
import SortModes from './sortModes'
import RangeSlider from './rangeSlider'
import CountSlider from './countSlider'
import SortDirectionModes from './sortDirectionModes'
import PositionModes from './positionModes'

import styles from './css/searchControls.module.css'

export default function SearchControls (): JSX.Element {
  return (
    <Box class={styles.controls}>
      <div class={styles.query}>
        <SourceDropdown />
        <SearchQuery />
        <SearchView />
      </div>

      <div class={styles.parameters}>
        <div class={styles.parameterValues}>
          <div>
            <CoverageSlider />
          </div>

          <div>
            <LinkageSlider />
          </div>

          <div>
            <RangeSlider />
          </div>

          <div>
            <CountSlider />
          </div>

          <div>
            <SortModes />
          </div>

          <div>
            <SortDirectionModes />
          </div>

          <div>
            <PositionModes />
          </div>

          <div>
            <ClusterModes />
          </div>

          <div>
            <PersistingNodes />
          </div>
        </div>
      </div>

      <div class={styles.actions}>
        <SearchActions />
      </div>
    </Box>
  )
}
