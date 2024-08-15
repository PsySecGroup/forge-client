import { type JSX } from 'solid-js'
import Modes from './base/modes'

export default function SortDirectionModes (): JSX.Element {
  return (
    <Modes
      name="Sort Direction"
      options={[
        {
          label: 'Closest',
          value: 'asc',
          property: 'sortDir'
        },
        {
          label: 'Farthest',
          value: 'desc',
          property: 'sortDir'
        }
      ]}
    />
  )
}
