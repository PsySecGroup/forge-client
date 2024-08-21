import { type JSX } from 'solid-js'
import Slider from './base/slider'

const MAX_RANGE = 1000

export default function RangeSlider (): JSX.Element {
  return (<Slider
    min={1}
    max={MAX_RANGE}
    spaceProperty="range"
    name="Range"
    leftLabel='Shallow'
    rightLabel='Deep'
  />)
}
