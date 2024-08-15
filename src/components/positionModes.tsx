import { type JSX } from 'solid-js'
import Modes from './base/modes'

export default function PositionModes (): JSX.Element {
  return (
    <Modes
      name="Position"
      options={[
        {
          label: 'All',
          value: 'all',
          property: 'position'
        },
        {
          label: 'Top',
          value: 'top',
          property: 'position'
        },
        {
          label: 'Middle',
          value: 'middle',
          property: 'position'
        },
        {
          label: 'Bottom',
          value: 'bottom',
          property: 'position'
        }
      ]}
    />
  )
}
