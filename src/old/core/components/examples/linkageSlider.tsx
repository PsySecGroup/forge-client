import { type JSX } from 'solid-js'
import styles from './css/searchLinkage.module.css'
import Slider from './base/slider'

const MAX_DEPTH = 20

export default function LinkageSlider (): JSX.Element {
  return (<Slider
    min={1}
    max={MAX_DEPTH}
    spaceProperty="graphDepth"
    name="Linkage"
    leftLabel='Short'
    rightLabel='Long'
    styles={styles}
  />)
}
