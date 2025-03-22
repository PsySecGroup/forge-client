import { type JSX } from 'solid-js'
import Slider from './base/slider'

const MAX_COUNT = 500

export default function CountSlider (): JSX.Element {
  return (<Slider
    min={1}
    max={MAX_COUNT}
    spaceProperty="count"
    name="Count"
    leftLabel='Few'
    rightLabel='Many'
  />)
}
