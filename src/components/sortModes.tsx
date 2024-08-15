import { type JSX } from 'solid-js'
import Modes from './base/modes'

import styles from './css/sortModes.module.css'

export default function SortModes (): JSX.Element {
  return (
    <Modes
      name="Sort By"
      styles={styles}
      options={[
        {
          label: 'Relevance',
          value: 'relevance',
          property: 'sort'
        },
        {
          label: 'Distance',
          value: 'distance',
          property: 'sort'
        },
        {
          label: 'Topical',
          value: 'topical',
          property: 'sort'
        }
      ]}
    />
  )
}
