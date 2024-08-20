import { type JSX } from 'solid-js'
import styles from './css/searchCoverage.module.css'
import Slider from './base/slider'

export default function CoverageSlider (): JSX.Element {
  return (<Slider
    min={1}
    max={100}
    spaceProperty="coverage"
    name="Coverage"
    leftLabel="Narrow"
    rightLabel="Wide"
    suffix="%"
    styles={styles}
  />)
}
