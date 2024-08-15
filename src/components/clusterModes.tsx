import { type JSX } from 'solid-js'
import Modes from './base/modes'

import styles from './css/clusterModes.module.css'

export default function ClusteringModes (): JSX.Element {
  return (
    <Modes
      name="Clustering"
      styles={styles}
      options={[
        {
          label: 'Concepts',
          value: 'concepts',
          property: 'clustering'
        },
        {
          label: 'Relations',
          value: 'relations',
          property: 'clustering'
        },
        {
          label: 'Tokens',
          value: 'tokens',
          property: 'clustering'
        }
      ]}
    />
  )
}
