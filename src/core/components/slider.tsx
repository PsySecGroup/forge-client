import { Box } from '@suid/material'
import { batch, type JSX } from 'solid-js'
import { useStoreContext } from '../../core'

import styles from '../css/slider.module.css'
import { type Space } from '../../core/types'

interface Props {
  min: number
  max: number
  spaceProperty: keyof Space
  name: string
  suffix?: string
  leftLabel?: string
  rightLabel?: string
  styles?: CSSModuleClasses
  onUpdate?: () => void
}

export default function Slider (props: Props): JSX.Element {
  const { updateFocusedSpace, getFocusedSpace } = useStoreContext()

  const updateSlide = (e: any): void => {
    batch(() => {
      updateFocusedSpace({
        [props.spaceProperty]: e.target.value
      })

      if (props.onUpdate !== undefined) {
        props.onUpdate()
      }
    })
  }

  const hasLabel = props.leftLabel !== undefined || props.rightLabel !== undefined
  const labelHeight = hasLabel
    ? '1em'
    : '0'

  return (
    <Box class={props.styles?.sliderComponent ?? styles.sliderComponent}>
      <div class={props.styles?.sliderHeader ?? styles.sliderHeader}>
        <span><b>{props.name}</b></span>
        <span>{getFocusedSpace()[props.spaceProperty] as number}{props.suffix ?? ''}</span>
      </div>
      <div class={props.styles?.sliderContainer ?? styles.sliderContainer}>
        <input
          type="range"
          min={props.min}
          max={props.max}
          value={getFocusedSpace()[props.spaceProperty] as number}
          class={props.styles?.slider ?? styles.slider}
          onInput={updateSlide}
          id={`slider.${props.name}`}
        />
      </div>
      <div style={{ height: labelHeight }}>
        <span class={props.styles?.leftLabel ?? styles.leftText}>{props.leftLabel ?? ''}</span>
        <span class={props.styles?.rightLabel ?? styles.rightText}>{props.rightLabel ?? ''}</span>
      </div>
    </Box>
  )
}
